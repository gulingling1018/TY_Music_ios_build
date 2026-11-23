import Foundation
import WebKit

/// 给共用 Vue 前端提供 `window.Android` 兼容层。
/// 已实现：正式界面、本地导入/播放、标题搜索、B 站搜索与匿名音频下载。
@MainActor
final class AndroidAPIHandler: NSObject, WKScriptMessageHandler {
    static let scriptMessageName = "tyMusicApi"

    private let runtime: ProbeRuntime
    private let bili = BiliMediaProbeService()
    private weak var webView: WKWebView?

    private struct ScanState {
        var running = false
        var phase = "idle"
        var newCount = 0
        var count = 0
        var message = ""
        var error: String?
    }

    private var scan = ScanState()
    private var scanTask: Task<Void, Never>?
    private var downloadPolicy: [String: Any] = [
        "startupScanMode": "always",
        "searchCacheMode": "current_track",
        "autoRepairMode": "wifi_only",
        "maxBackgroundDispatch": 1,
        "maxManualDispatch": 2,
        "maxGlobalDispatch": 3,
        "panelShowBackgroundTasks": false,
        "panelManualOnly": false
    ]

    init(runtime: ProbeRuntime) {
        self.runtime = runtime
    }

    func attach(_ webView: WKWebView) {
        self.webView = webView
    }

    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame,
              PathPolicy.trustedPage(message.frameInfo.request.url),
              PathPolicy.trustedPage(webView?.url),
              let payload = message.body as? [String: Any],
              let method = payload["method"] as? String,
              let rawURL = payload["url"] as? String,
              let callbackId = payload["callbackId"] as? String,
              !callbackId.isEmpty, callbackId.count <= 64,
              !rawURL.isEmpty, rawURL.count <= 4096 else { return }

        let body = payload["body"] as? String ?? ""
        Task { [weak self] in
            guard let self else { return }
            let result = await self.envelope(method: method.uppercased(), rawURL: rawURL, body: body)
            self.respond(callbackId: callbackId, envelope: result)
        }
    }

    private func respond(callbackId: String, envelope: [String: Any]) {
        guard let webView,
              JSONSerialization.isValidJSONObject(envelope),
              let data = try? JSONSerialization.data(withJSONObject: envelope),
              let json = String(data: data, encoding: .utf8) else { return }
        webView.callAsyncJavaScript("window.__apiCallback(callbackId, payload);",
                                    arguments: ["callbackId": callbackId, "payload": json],
                                    in: nil, in: .page) { _ in }
    }

    private func envelope(method: String, rawURL: String, body: String) async -> [String: Any] {
        guard let components = URLComponents(string: rawURL) else {
            return Self.error(400, "INVALID_URL", "无效请求地址")
        }
        let path = components.path.isEmpty ? "/" : components.path
        let items = components.queryItems

        if method == "POST", path == "/api/playlist/scan-local" {
            return startLocalScan()
        }
        if method == "GET", path == "/api/scan-progress" {
            return scanProgressEnvelope()
        }
        if method == "GET", path == "/api/search" {
            return searchEnvelope(items: items)
        }
        if method == "GET", path == "/api/bili-search" {
            return await biliSearchEnvelope(items: items)
        }
        if method == "POST", path == "/api/log" {
            return ["status": 200, "data": ["success": true]]
        }
        if method == "GET", path == "/api/playlists" {
            return ["status": 200, "data": ["playlists": pinnedPlaylists()]]
        }
        if method == "GET", path == "/api/playlist/local_music" {
            return ["status": 200, "data": ["songs": runtime.library.songPayload(), "reorder_count": 0]]
        }
        if method == "GET", path == "/api/playlist/bili_downloads" {
            return ["status": 200, "data": ["songs": downloadedSongs(), "reorder_count": 0]]
        }
        if method == "GET", path.hasPrefix("/api/playlist/"), path.hasSuffix("/get") {
            return ["status": 200, "data": ["songs": []]]
        }
        if method == "GET", path.hasPrefix("/api/playlist/") {
            return ["status": 200, "data": ["songs": [], "reorder_count": 0]]
        }

        if method == "GET", path == "/api/download-tasks" {
            return downloadTasksEnvelope(items: items)
        }
        if method == "POST", path == "/api/download-tasks" {
            return await createDownloadTask(rawBody: body)
        }
        if method == "POST", path == "/api/download-tasks/batch-control" {
            return batchControl(rawBody: body)
        }
        if method == "DELETE", path.hasPrefix("/api/download-tasks/") {
            return deleteDownloadTask(path: path)
        }
        if method == "GET", path.hasPrefix("/api/download-tasks/") {
            return singleDownloadTask(path: path)
        }
        if method == "POST", path.hasPrefix("/api/download-tasks/"), path.hasSuffix("/control") {
            return await controlDownloadTask(path: path, rawBody: body)
        }
        if method == "GET", path == "/api/download-stats" {
            return ["status": 200, "data": Self.downloadStats(runtime.downloads.records)]
        }
        if method == "GET", path == "/api/download-policy" {
            return policyEnvelope()
        }
        if method == "POST", path == "/api/download-policy" {
            return updatePolicy(rawBody: body)
        }

        if method == "GET", path == "/api/auth/bilibili/status" {
            return ["status": 200, "data": ["loggedIn": false, "authorized": false]]
        }
        if method == "GET", path == "/api/auth/bilibili/user" {
            return ["status": 200, "data": ["user": NSNull()]]
        }
        if method == "GET", path == "/api/account/listen-stats" {
            return ["status": 200, "data": [String: Any]()]
        }
        return Self.error(501, "NOT_IMPLEMENTED", "iOS 版本尚未实现该接口")
    }

    // MARK: - 本地导入与搜索

    private func startLocalScan() -> [String: Any] {
        guard scanTask == nil else {
            return ["status": 200, "data": ["started": false, "alreadyRunning": true]]
        }
        scan = ScanState(running: true, phase: "scanning", newCount: 0,
                         count: runtime.library.tracks.count, message: "正在选择音频文件…", error: nil)
        scanTask = Task { [weak self] in
            guard let self else { return }
            do {
                let picked = try await self.runtime.importer.pick()
                let added = try self.runtime.library.add(picked)
                self.finishScan(added: added, error: nil)
            } catch let error as ProbeError where error.code == "CANCELLED" {
                self.finishScan(added: 0, error: "已取消导入")
            } catch {
                self.finishScan(added: 0, error: error.localizedDescription)
            }
        }
        return ["status": 200, "data": ["started": true]]
    }

    private func finishScan(added: Int, error: String?) {
        scanTask = nil
        scan.running = false
        scan.phase = error == nil ? "done" : "error"
        scan.newCount = added
        scan.count = runtime.library.tracks.count
        scan.message = error ?? "导入完成"
        scan.error = error
    }

    private func scanProgressEnvelope() -> [String: Any] {
        ["status": 200, "data": [
            "isRunning": scan.running,
            "phase": scan.phase,
            "newCount": scan.newCount,
            "count": scan.count,
            "message": scan.message,
            "error": (scan.error as Any?) ?? NSNull()
        ]]
    }

    private func searchEnvelope(items: [URLQueryItem]?) -> [String: Any] {
        let keyword = Self.query(items, "q") ?? ""
        let page = max(1, Self.intValue(Self.query(items, "page")) ?? 1)
        let limit = min(100, max(1, Self.intValue(Self.query(items, "limit")) ?? 30))
        let result = runtime.library.search(keyword, page: page, limit: limit)
        return ["status": 200, "data": [
            "success": true,
            "songs": result.songs,
            "page": page,
            "pageSize": limit,
            "limit": limit,
            "resultCount": result.total,
            "hasMore": result.hasMore,
            "searchKind": "local",
            "asyncSearchPending": false
        ]]
    }

    private func biliSearchEnvelope(items: [URLQueryItem]?) async -> [String: Any] {
        let keyword = Self.query(items, "q") ?? ""
        do {
            let videos = try await bili.searchVideos(keyword)
            return ["status": 200, "data": [
                "success": true,
                "keyword": keyword,
                "resultCount": videos.count,
                "videos": videos
            ]]
        } catch {
            return ["status": 200, "data": [
                "success": false,
                "keyword": keyword,
                "resultCount": 0,
                "videos": [],
                "error": error.localizedDescription
            ]]
        }
    }

    // MARK: - 下载任务

    private func createDownloadTask(rawBody: String) async -> [String: Any] {
        let body = jsonBody(rawBody)
        let input = ((body["url"] as? String) ?? (body["bvid"] as? String) ?? "")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        guard !input.isEmpty, input.count <= 8192 else {
            return Self.error(400, "INVALID_INPUT", "缺少视频地址")
        }
        let page = Self.page(from: input) ?? Self.intValue(body["page"]) ?? 1
        do {
            let candidate = try await bili.resolve(input, page: page)
            let clientTaskId = (body["clientTaskId"] as? String)?
                .trimmingCharacters(in: .whitespacesAndNewlines)
            let result = try runtime.downloads.enqueueTask(
                url: candidate.url,
                title: candidate.title,
                referer: "https://www.bilibili.com/",
                id: clientTaskId,
                sourceURL: input,
                bvid: candidate.bvid,
                cover: body["cover"] as? String,
                page: page
            )
            return ["status": 200, "data": [
                "success": true,
                "taskId": result.id,
                "status": "queued",
                "duplicate": result.duplicate
            ]]
        } catch {
            return Self.error(400, "DOWNLOAD_CREATE", error.localizedDescription)
        }
    }

    private func downloadTasksEnvelope(items: [URLQueryItem]?) -> [String: Any] {
        let activeOnly = Self.query(items, "active") == "1"
        let limit = min(600, max(1, Self.intValue(Self.query(items, "limit")) ?? 200))
        let records = runtime.downloads.records
        let filtered = activeOnly
            ? records.filter { ["running", "paused", "interrupted"].contains($0.state) }
            : records
        let sorted = filtered.sorted { ($0.createdAt ?? 0) > ($1.createdAt ?? 0) }
        let tasks = Array(sorted.prefix(limit)).map { Self.nativeTask($0) }
        return ["status": 200, "data": ["tasks": tasks, "stats": Self.downloadStats(records)]]
    }

    private func singleDownloadTask(path: String) -> [String: Any] {
        let id = Self.taskID(from: path)
        guard !id.isEmpty, let record = runtime.downloads.record(id) else {
            return Self.error(404, "TASK_NOT_FOUND", "下载任务不存在")
        }
        return ["status": 200, "data": ["task": Self.nativeTask(record)]]
    }

    private func controlDownloadTask(path: String, rawBody: String) async -> [String: Any] {
        let id = Self.taskID(from: path)
        guard !id.isEmpty, runtime.downloads.record(id) != nil else {
            return ["status": 200, "data": ["success": false, "accepted": false,
                                            "reason": "下载任务不存在",
                                            "stats": Self.downloadStats(runtime.downloads.records)]]
        }
        let action = ((jsonBody(rawBody)["action"] as? String) ?? "").lowercased()
        do {
            switch action {
            case "cancel":
                try runtime.downloads.cancel(id)
            case "pause", "pause_queue":
                try runtime.downloads.suspend(id)
            case "resume", "resume_queue":
                try runtime.downloads.resumeTask(id)
            case "delete":
                try runtime.downloads.delete(id)
            case "retry":
                guard let record = runtime.downloads.record(id), let source = record.sourceURL else {
                    return ["status": 200, "data": ["success": false, "accepted": false,
                                                    "reason": "缺少原始视频地址",
                                                    "stats": Self.downloadStats(runtime.downloads.records)]]
                }
                let candidate = try await bili.resolve(source, page: record.page ?? 1)
                try runtime.downloads.restart(id: id, url: candidate.url, referer: "https://www.bilibili.com/")
            default:
                return ["status": 200, "data": ["success": false, "accepted": false,
                                                "reason": "不支持的操作",
                                                "stats": Self.downloadStats(runtime.downloads.records)]]
            }
            return ["status": 200, "data": ["success": true, "accepted": true,
                                            "stats": Self.downloadStats(runtime.downloads.records)]]
        } catch {
            return ["status": 200, "data": ["success": false, "accepted": false,
                                            "reason": error.localizedDescription,
                                            "stats": Self.downloadStats(runtime.downloads.records)]]
        }
    }

    private func deleteDownloadTask(path: String) -> [String: Any] {
        let id = Self.taskID(from: path)
        guard !id.isEmpty else { return Self.error(400, "INVALID_ID", "缺少任务ID") }
        do {
            try runtime.downloads.delete(id)
            return ["status": 200, "data": ["success": true, "stats": Self.downloadStats(runtime.downloads.records)]]
        } catch {
            return ["status": 200, "data": ["success": false, "reason": error.localizedDescription,
                                            "stats": Self.downloadStats(runtime.downloads.records)]]
        }
    }

    private func batchControl(rawBody: String) -> [String: Any] {
        let body = jsonBody(rawBody)
        let action = ((body["action"] as? String) ?? "").lowercased()
        let scope = body["scope"] as? [String: Any] ?? [:]
        let statuses = (scope["status"] as? [String])?.map { $0.lowercased() }
        let explicitIds = (scope["taskIds"] as? [String]) ?? (body["taskIds"] as? [String])
        let records = runtime.downloads.records
        let targetIds: [String]
        if let explicitIds, !explicitIds.isEmpty {
            targetIds = explicitIds
        } else if let statuses, !statuses.isEmpty {
            targetIds = records.filter { record in
                statuses.contains(Self.localStatus(record.state))
            }.map(\.id)
        } else {
            targetIds = records.map(\.id)
        }

        var affected: [String] = []
        for id in targetIds {
            do {
                switch action {
                case "delete": try runtime.downloads.delete(id)
                case "cancel": try runtime.downloads.cancel(id)
                case "pause", "pause_queue": try runtime.downloads.suspend(id)
                case "resume", "resume_queue": try runtime.downloads.resumeTask(id)
                default: break
                }
                affected.append(id)
            } catch { }
        }
        return ["status": 200, "data": [
            "success": true,
            "affected": affected,
            "effectiveAction": action,
            "stats": Self.downloadStats(runtime.downloads.records)
        ]]
    }

    private func policyEnvelope() -> [String: Any] {
        ["status": 200, "data": ["policy": downloadPolicy]]
    }

    private func updatePolicy(rawBody: String) -> [String: Any] {
        for (key, value) in jsonBody(rawBody) {
            downloadPolicy[key] = value
        }
        return policyEnvelope()
    }

    private func pinnedPlaylists() -> [[String: Any]] {
        [
            ["id": "local_music", "name": "本地音乐", "count": runtime.library.tracks.count, "isCustom": false],
            ["id": "bili_downloads", "name": "下载", "count": downloadedSongs().count, "isCustom": false]
        ]
    }

    private func downloadedSongs() -> [[String: Any]] {
        runtime.downloads.records.compactMap { record in
            guard record.state == "completed", let track = record.track,
                  var song = LocalMusicLibrary.payload(for: track) else { return nil }
            if let cover = record.cover, !cover.isEmpty { song["cover"] = cover }
            return song
        }
    }

    private static func nativeTask(_ record: ProbeDownload) -> [String: Any] {
        let status: String
        let business: String
        switch record.state {
        case "running": status = "running"; business = "running"
        case "paused": status = "paused"; business = "paused"
        case "completed": status = "success"; business = "success"
        case "cancelled": status = "cancelled"; business = "cancelled"
        case "failed", "interrupted": status = "failed"; business = "failed_final"
        default: status = "queued"; business = "queued"
        }
        let progress: Int
        if record.state == "completed" {
            progress = 100
        } else if record.expected > 0 {
            progress = min(100, max(0, Int(record.received * 100 / record.expected)))
        } else {
            progress = 0
        }
        let createdAt = record.createdAt ?? 0
        let updatedAt = record.updatedAt ?? createdAt
        var payload: [String: Any] = [
            "taskType": "download_explicit",
            "title": record.title,
            "url": record.sourceURL ?? "",
            "bvid": record.bvid ?? "",
            "source": "bili_download",
            "queueOrderHint": createdAt,
            "dedupeKey": "bili:\(record.sourceURL ?? record.id)",
            "hashId": record.id,
            "progress": progress,
            "speedKbps": 0,
            "attempt": 0,
            "maxAttempts": 4,
            "startedAt": createdAt,
            "lastProgressAt": updatedAt
        ]
        if let track = record.track, let relative = track.relativePath {
            payload["filePath"] = relative
        }
        if let cover = record.cover, !cover.isEmpty { payload["cover"] = cover }
        return [
            "taskId": record.id,
            "status": status,
            "businessStatus": business,
            "taskType": "download_explicit",
            "title": record.title,
            "createdAt": createdAt,
            "updatedAt": updatedAt,
            "error": record.error ?? "",
            "payload": payload
        ]
    }

    private static func localStatus(_ state: String) -> String {
        switch state {
        case "completed": return "success"
        case "failed", "interrupted": return "failed"
        default: return state
        }
    }

    private static func downloadStats(_ records: [ProbeDownload]) -> [String: Any] {
        var stats: [String: Any] = [
            "total": records.count, "queued": 0, "running": 0, "paused": 0,
            "success": 0, "failed": 0, "cancelled": 0
        ]
        func bump(_ key: String) { stats[key] = (stats[key] as? Int ?? 0) + 1 }
        for record in records {
            switch record.state {
            case "running": bump("running")
            case "paused": bump("paused")
            case "completed": bump("success")
            case "cancelled": bump("cancelled")
            case "failed", "interrupted": bump("failed")
            default: bump("queued")
            }
        }
        stats["active"] = (stats["running"] as? Int ?? 0)
            + (stats["paused"] as? Int ?? 0)
            + (stats["queued"] as? Int ?? 0)
        return stats
    }

    // MARK: - Helpers

    private func jsonBody(_ raw: String) -> [String: Any] {
        guard let data = raw.data(using: .utf8),
              let value = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            return [:]
        }
        return value
    }

    private static func query(_ items: [URLQueryItem]?, _ name: String) -> String? {
        items?.first(where: { $0.name == name })?.value
    }

    private static func intValue(_ value: Any?) -> Int? {
        if let number = value as? NSNumber { return number.intValue }
        if let string = value as? String { return Int(string) }
        return nil
    }

    private static func page(from input: String) -> Int? {
        guard let components = URLComponents(string: input),
              let raw = components.queryItems?.first(where: { $0.name == "p" })?.value,
              let page = Int(raw), (1...10000).contains(page) else { return nil }
        return page
    }

    private static func taskID(from path: String) -> String {
        var value = path
        let prefix = "/api/download-tasks/"
        if value.hasPrefix(prefix) { value.removeFirst(prefix.count) }
        let suffix = "/control"
        if value.hasSuffix(suffix) { value.removeLast(suffix.count) }
        return value.removingPercentEncoding ?? value
    }

    private static func error(_ status: Int, _ code: String, _ message: String) -> [String: Any] {
        ["status": status, "error": ["code": code, "message": message]]
    }

    /// 在文档开始前注入，保证前端模块加载时已经能看到 window.Android。
    static let shimScript = """
    (function () {
      if (window.Android && typeof window.Android.callApiAsync === 'function') return;
      window.__apiCallbacks = window.__apiCallbacks || {};
      window.__apiCallbackSeq = window.__apiCallbackSeq || 0;
      window.__apiCallback = function (id, responseStr) {
        var cb = window.__apiCallbacks[id];
        if (!cb) return;
        delete window.__apiCallbacks[id];
        try { cb(responseStr); } catch (e) {}
      };
      var deviceId = '';
      try { deviceId = localStorage.getItem('ty_ios_device_id') || ''; } catch (e) {}
      if (!deviceId) {
        deviceId = 'ios-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
        try { localStorage.setItem('ty_ios_device_id', deviceId); } catch (e) {}
      }
      function noop() {}
      window.Android = {
        callApiAsync: function (method, url, body, headers, callbackId) {
          try {
            window.webkit.messageHandlers.tyMusicApi.postMessage({
              method: String(method || 'GET'),
              url: String(url || ''),
              body: String(body || ''),
              headers: String(headers || ''),
              callbackId: String(callbackId || '')
            });
          } catch (e) {
            window.__apiCallback(String(callbackId || ''), JSON.stringify({
              status: 500,
              error: { code: 'BRIDGE_ERROR', message: '原生桥不可用' }
            }));
          }
        },
        getDeviceId: function () { return deviceId; },
        hasLocalAudio: function () { return false; },
        hasLocalCover: function () { return false; },
        getLocalAudioPath: function () { return ''; },
        getPlayerResumeCache: function () { return ''; },
        savePlayerResumeCache: function () { return false; },
        getPlaylistQueue: function () { return ''; },
        savePlaylistQueue: function () { return false; },
        getSearchDbImportStatus: function () { return ''; },
        beginSearchDbImport: noop,
        appendSearchDbImportChunk: noop,
        finishSearchDbImport: noop,
        cancelSearchDbImport: noop,
        readLyricsFile: function () { return ''; },
        consumePickedFileUri: function () { return ''; },
        ensureFeaturePermissions: function () { return true; },
        openBiliBrowser: noop,
        setVideoFullscreen: noop,
        setVideoPlaybackActive: noop,
        saveImageToGallery: noop,
        downloadCoverFromUrl: noop,
        onPlaylistExit: noop,
        vibrate: noop,
        updatePlaybackProgress: noop,
        syncPlaybackToSystem: noop,
        notifySongStarted: noop,
        recordPlaybackEvents: noop,
        replayPendingCacheEvents: noop
      };
    })();
    """
}
