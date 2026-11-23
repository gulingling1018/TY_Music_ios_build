import Foundation

struct ProbeDownload: Codable {
    let id: String
    let title: String
    var state: String
    var received: Int64 = 0
    var expected: Int64 = -1
    var track: AudioTrack?
    var error: String?
    var sourceURL: String?
    var bvid: String?
    var cover: String?
    var page: Int?
    var createdAt: Double?
    var updatedAt: Double?
}

// URLSession delegateQueue固定为main；业务调用同样由主线程桥接路由进入。
// 此处只实现风险原型传输，不替代正式DownloadTaskScheduler契约。
final class ProbeDownloadService: NSObject, URLSessionDownloadDelegate {
    static let sessionIdentifier = "site.meiluoluo.tymusic.ios.downloads.v1"
    private let root: URL
    private let store: AtomicJSONStore<[ProbeDownload]>
    private(set) var records: [ProbeDownload] = []
    private var tasks: [String: URLSessionDownloadTask] = [:]
    private var ready = false
    private var storageError: String?
    var onChange: (() -> Void)?
    var backgroundCompletion: (() -> Void)?
    private lazy var session: URLSession = {
        let config = URLSessionConfiguration.background(withIdentifier: Self.sessionIdentifier)
        config.waitsForConnectivity = true
        config.isDiscretionary = false
        config.sessionSendsLaunchEvents = true
        config.httpMaximumConnectionsPerHost = 3
        return URLSession(configuration: config, delegate: self, delegateQueue: .main)
    }()

    init(root: URL, stateURL: URL) {
        self.root = root
        self.store = AtomicJSONStore(url: stateURL)
        super.init()
        do { records = try store.load() ?? [] }
        catch { storageError = "下载记录恢复失败：\(error.localizedDescription)" }
    }

    func restore() {
        session.getAllTasks { [weak self] restored in
            DispatchQueue.main.async {
                guard let self else { return }
                for task in restored {
                    guard let id = task.taskDescription, let download = task as? URLSessionDownloadTask,
                          self.records.contains(where: { $0.id == id }) else { task.cancel(); continue }
                    self.tasks[id] = download
                }
                for index in self.records.indices where self.records[index].state == "running" {
                    if self.tasks[self.records[index].id] == nil {
                        self.records[index].state = "interrupted"
                        self.records[index].error = "系统任务已不存在，请重新解析媒体后重试"
                    }
                }
                self.ready = true
                self.persist()
            }
        }
    }

    func snapshot() throws -> [String: Any] {
        ["ready": ready, "records": try records.jsonObject(), "storageError": (storageError as Any?) ?? NSNull()]
    }

    func enqueue(url: URL, title: String, referer: String? = nil) throws -> String {
        try enqueueTask(url: url, title: title, referer: referer).id
    }

    func record(_ id: String) -> ProbeDownload? {
        records.first(where: { $0.id == id })
    }

    /// 正式前端会传 clientTaskId；用它作为原生记录 ID，保证两侧任务身份一致。
    @discardableResult
    func enqueueTask(url: URL, title: String, referer: String? = nil,
                     id requestedId: String? = nil, sourceURL: String? = nil,
                     bvid: String? = nil, cover: String? = nil, page: Int? = nil) throws -> (id: String, duplicate: Bool) {
        guard ready else { throw ProbeError(code: "RESTORING", message: "正在恢复系统下载任务，请稍后重试") }
        guard tasks.count < 8, records.count < 1000 else { throw ProbeError.invalid("下载任务数量已达上限") }
        _ = try PathPolicy.networkURL(url.absoluteString)

        let id: String
        if let requestedId {
            let trimmed = requestedId.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !trimmed.isEmpty, trimmed.count <= 128,
                  trimmed.range(of: "^[A-Za-z0-9_-]+$", options: .regularExpression) != nil else {
                throw ProbeError.invalid("下载任务ID无效")
            }
            id = trimmed
        } else {
            id = UUID().uuidString
        }
        if records.contains(where: { $0.id == id }) {
            return (id, true)
        }

        var request = URLRequest(url: url)
        request.setValue("Mozilla/5.0 TYMusic-iOS-Probe", forHTTPHeaderField: "User-Agent")
        if let referer { request.setValue(referer, forHTTPHeaderField: "Referer") }
        let task = session.downloadTask(with: request)
        task.taskDescription = id
        let timestamp = Date().timeIntervalSince1970 * 1000
        let record = ProbeDownload(id: id, title: String(title.prefix(256)), state: "running",
                                   sourceURL: sourceURL, bvid: bvid, cover: cover, page: page,
                                   createdAt: timestamp, updatedAt: timestamp)
        // 先持久化业务ID，再启动系统传输，避免重启后孤立任务。
        do { try store.save(records + [record]) }
        catch { task.cancel(); throw error }
        records.append(record)
        tasks[id] = task
        task.resume()
        onChange?()
        return (id, false)
    }

    func cancel(_ id: String) throws {
        guard let index = records.firstIndex(where: { $0.id == id }),
              ["running", "paused"].contains(records[index].state) else {
            throw ProbeError.invalid("没有可取消的下载任务")
        }
        records[index].state = "cancelled"
        records[index].updatedAt = Date().timeIntervalSince1970 * 1000
        tasks[id]?.cancel()
        tasks[id] = nil
        persist()
    }

    func suspend(_ id: String) throws {
        guard let index = records.firstIndex(where: { $0.id == id }), let task = tasks[id],
              records[index].state == "running" else {
            throw ProbeError.invalid("没有可暂停的下载任务")
        }
        task.suspend()
        records[index].state = "paused"
        records[index].updatedAt = Date().timeIntervalSince1970 * 1000
        persist()
    }

    func resumeTask(_ id: String) throws {
        guard let index = records.firstIndex(where: { $0.id == id }), let task = tasks[id],
              records[index].state == "paused" else {
            throw ProbeError.invalid("没有可恢复的下载任务")
        }
        task.resume()
        records[index].state = "running"
        records[index].updatedAt = Date().timeIntervalSince1970 * 1000
        persist()
    }

    func restart(id: String, url: URL, referer: String? = nil) throws {
        guard let index = records.firstIndex(where: { $0.id == id }) else {
            throw ProbeError.invalid("下载任务不存在")
        }
        guard tasks[id] == nil else { throw ProbeError(code: "BUSY", message: "下载任务仍在运行") }
        _ = try PathPolicy.networkURL(url.absoluteString)
        var request = URLRequest(url: url)
        request.setValue("Mozilla/5.0 TYMusic-iOS-Probe", forHTTPHeaderField: "User-Agent")
        if let referer { request.setValue(referer, forHTTPHeaderField: "Referer") }
        let task = session.downloadTask(with: request)
        task.taskDescription = id
        records[index].state = "running"
        records[index].received = 0
        records[index].expected = -1
        records[index].error = nil
        records[index].updatedAt = Date().timeIntervalSince1970 * 1000
        try store.save(records)
        tasks[id] = task
        task.resume()
        onChange?()
    }

    func delete(_ id: String) throws {
        guard let index = records.firstIndex(where: { $0.id == id }) else {
            throw ProbeError.invalid("下载任务不存在")
        }
        tasks[id]?.cancel()
        tasks[id] = nil
        if let path = records[index].track?.relativePath,
           let file = try? PathPolicy.resolve(path, within: root) {
            try? FileManager.default.removeItem(at: file)
        }
        records.remove(at: index)
        persist()
    }

    func completedTracks() -> [AudioTrack] { records.compactMap(\.track) }

    func urlSession(_ session: URLSession, downloadTask: URLSessionDownloadTask,
                    didWriteData bytesWritten: Int64, totalBytesWritten: Int64, totalBytesExpectedToWrite: Int64) {
        guard let id = downloadTask.taskDescription, let index = records.firstIndex(where: { $0.id == id }),
              records[index].state == "running" else { return }
        records[index].received = totalBytesWritten
        records[index].expected = totalBytesExpectedToWrite
        records[index].updatedAt = Date().timeIntervalSince1970 * 1000
        onChange?()
    }

    func urlSession(_ session: URLSession, downloadTask: URLSessionDownloadTask, didFinishDownloadingTo location: URL) {
        guard let id = downloadTask.taskDescription, let index = records.firstIndex(where: { $0.id == id }),
              records[index].state == "running" else { return }
        do {
            guard let response = downloadTask.response as? HTTPURLResponse, response.statusCode == 200,
                  let mime = response.mimeType?.lowercased(),
                  mime.hasPrefix("audio/") || mime == "video/mp4" || mime == "application/octet-stream" else {
                throw ProbeError(code: "DOWNLOAD_RESPONSE", message: "下载返回非音频响应或HTTP错误，请重新解析链接")
            }
            guard (try location.resourceValues(forKeys: [.fileSizeKey]).fileSize ?? 0) > 0 else {
                throw ProbeError.invalid("下载结果为空")
            }
            let sourceExt = downloadTask.originalRequest?.url?.pathExtension.lowercased() ?? ""
            let ext = ["mp3", "m4a", "mp4", "aac", "wav", "flac"].contains(sourceExt) ? sourceExt : "m4a"
            let relative = "Music/\(id).\(ext)"
            let target = try PathPolicy.resolve(relative, within: root)
            try FileManager.default.createDirectory(at: target.deletingLastPathComponent(), withIntermediateDirectories: true)
            try FileManager.default.moveItem(at: location, to: target)
            records[index].track = AudioTrack(id: id, title: records[index].title, relativePath: relative, remoteURL: nil)
            records[index].state = "completed"
            records[index].error = nil
            records[index].updatedAt = Date().timeIntervalSince1970 * 1000
        } catch {
            records[index].state = "failed"
            records[index].error = error.localizedDescription
            records[index].updatedAt = Date().timeIntervalSince1970 * 1000
        }
        tasks[id] = nil
        persist()
    }

    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        guard let id = task.taskDescription, let index = records.firstIndex(where: { $0.id == id }) else { return }
        tasks[id] = nil
        if records[index].state == "running" {
            records[index].state = "failed"
            // 不把可能含签名URL的底层错误原文暴露到界面/日志。
            records[index].error = error == nil ? "下载没有生成文件" : "网络下载失败，请检查网络并重新解析链接"
        }
        records[index].updatedAt = Date().timeIntervalSince1970 * 1000
        persist()
    }

    func urlSessionDidFinishEvents(forBackgroundURLSession session: URLSession) {
        let completion = backgroundCompletion
        backgroundCompletion = nil
        completion?()
    }

    private func persist() {
        do { try store.save(records); storageError = nil }
        catch { storageError = "下载记录保存失败：\(error.localizedDescription)" }
        onChange?()
    }
}
