import Foundation
import WebKit

/// 给共用 Vue 前端提供 `window.Android` 兼容层。
/// 第一阶段只保证正式界面可以启动、首页歌单可以渲染；未实现接口显式返回 501，
/// 后续播放、搜索、下载按模块替换为真实实现。
@MainActor
final class AndroidAPIHandler: NSObject, WKScriptMessageHandler {
    static let scriptMessageName = "tyMusicApi"

    private weak var webView: WKWebView?

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
        let result = envelope(method: method.uppercased(), rawURL: rawURL, body: body)
        respond(callbackId: callbackId, envelope: result)
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

    private func envelope(method: String, rawURL: String, body: String) -> [String: Any] {
        guard let components = URLComponents(string: rawURL) else {
            return Self.error(400, "INVALID_URL", "无效请求地址")
        }
        let path = components.path.isEmpty ? "/" : components.path

        // 第一阶段：先让首页与内置歌单可显示。数据为空，但结构完整，后续换成 SQLite 实现。
        if method == "GET", path == "/api/playlists" {
            return ["status": 200, "data": ["playlists": Self.pinnedPlaylists]]
        }
        if method == "GET", path == "/api/playlist/local_music" || path == "/api/playlist/bili_downloads" {
            return ["status": 200, "data": ["songs": [], "reorder_count": 0]]
        }
        if method == "GET", path.hasPrefix("/api/playlist/"), path.hasSuffix("/get") {
            return ["status": 200, "data": ["songs": []]]
        }
        if method == "GET", path.hasPrefix("/api/playlist/") {
            return ["status": 200, "data": ["songs": [], "reorder_count": 0]]
        }
        if method == "GET", path == "/api/download-tasks" {
            return ["status": 200, "data": ["tasks": [], "total": 0]]
        }
        if method == "GET", path == "/api/download-stats" {
            return ["status": 200, "data": [String: Any]()]
        }
        if method == "GET", path == "/api/scan-progress" {
            return ["status": 200, "data": ["active": false, "progress": 0]]
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

    private static let pinnedPlaylists: [[String: Any]] = [
        ["id": "local_music", "name": "本地音乐", "count": 0, "isCustom": false],
        ["id": "bili_downloads", "name": "下载", "count": 0, "isCustom": false]
    ]

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
