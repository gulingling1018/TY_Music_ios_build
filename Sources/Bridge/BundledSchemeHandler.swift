import Foundation
import WebKit
import UniformTypeIdentifiers

final class BundledSchemeHandler: NSObject, WKURLSchemeHandler {
    private let root: URL
    private let mediaRoot: URL

    init(root: URL, mediaRoot: URL) {
        self.root = root
        self.mediaRoot = mediaRoot
    }

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        do {
            guard let url = urlSchemeTask.request.url, PathPolicy.trustedPage(url) else {
                throw ProbeError.invalid("不支持的资源请求")
            }
            let method = urlSchemeTask.request.httpMethod ?? "GET"
            guard method == "GET" || method == "HEAD" else {
                throw ProbeError.invalid("不支持的资源请求")
            }

            // 前端直接 <img src="/api/cover/..."> 的请求走这里；第一阶段统一返回内置占位封面。
            if url.path.hasPrefix("/api/cover/") {
                try sendPlaceholderCover(url: url, method: method, task: urlSchemeTask)
                return
            }
            // 前端把本地音频拼成 /api/stream_local?path=<相对路径>，这里按 Range 提供文件。
            if url.path == "/api/stream_local" {
                try sendLocalMedia(url: url, method: method, task: urlSchemeTask)
                return
            }
            guard method == "GET" else { throw ProbeError.invalid("不支持的资源请求") }

            // URL.path已解码；禁止再解码，否则可能误解合法含百分号的文件名。
            let relative = url.path == "/" ? "index.html" : String(url.path.dropFirst())
            let file = try PathPolicy.resolve(relative, within: root)
            let bytes = try Data(contentsOf: file)
            let explicit = ["js": "application/javascript", "mjs": "application/javascript", "css": "text/css", "html": "text/html", "json": "application/json", "svg": "image/svg+xml"]
            let mime = explicit[file.pathExtension] ?? UTType(filenameExtension: file.pathExtension)?.preferredMIMEType ?? "application/octet-stream"
            urlSchemeTask.didReceive(URLResponse(url: url, mimeType: mime, expectedContentLength: bytes.count,
                                                textEncodingName: ["js", "mjs", "css", "html", "json", "svg"].contains(file.pathExtension) ? "utf-8" : nil))
            urlSchemeTask.didReceive(bytes)
            urlSchemeTask.didFinish()
        } catch { urlSchemeTask.didFailWithError(error) }
    }

    // 当前只同步读取小型内置原型资源，不保留异步task，stop后不会回调已结束task。
    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}

    private func sendPlaceholderCover(url: URL, method: String, task: WKURLSchemeTask) throws {
        let data = Data(Self.placeholderCoverSvg.utf8)
        guard let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1",
                                             headerFields: ["Content-Type": "image/svg+xml",
                                                            "Content-Length": "\(data.count)"]) else {
            throw ProbeError.invalid("无法构造封面响应")
        }
        task.didReceive(response)
        if method != "HEAD" { task.didReceive(data) }
        task.didFinish()
    }

    private func sendLocalMedia(url: URL, method: String, task: WKURLSchemeTask) throws {
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        guard let relative = components?.queryItems?.first(where: { $0.name == "path" })?.value,
              !relative.isEmpty else {
            throw ProbeError.invalid("缺少音频路径")
        }
        let file = try PathPolicy.resolve(relative, within: mediaRoot)
        let values = try file.resourceValues(forKeys: [.fileSizeKey, .isRegularFileKey])
        guard values.isRegularFile == true, let size = values.fileSize else {
            throw ProbeError(code: "FILE_MISSING", message: "本地音频已不存在，请重新导入")
        }
        let total = Int64(size)
        let mime = UTType(filenameExtension: file.pathExtension)?.preferredMIMEType ?? "audio/mpeg"

        var status = 200
        var start: Int64 = 0
        var end = total - 1
        var headers: [String: String] = [
            "Content-Type": mime,
            "Accept-Ranges": "bytes",
            "Content-Length": "\(total)",
            "Cache-Control": "no-store"
        ]

        if total > 0, let rawRange = task.request.value(forHTTPHeaderField: "Range"), rawRange.hasPrefix("bytes=") {
            let spec = String(rawRange.dropFirst("bytes=".count))
            let parts = spec.split(separator: "-", maxSplits: 1, omittingEmptySubsequences: false)
            if parts.count == 2 {
                if parts[0].isEmpty, let suffix = Int64(parts[1]), suffix > 0 {
                    start = max(0, total - suffix)
                    end = total - 1
                } else if let value = Int64(parts[0]) {
                    start = max(0, min(value, total - 1))
                    if !parts[1].isEmpty, let upper = Int64(parts[1]) {
                        end = min(upper, total - 1)
                    }
                }
            }
            if start <= end {
                status = 206
                headers["Content-Range"] = "bytes \(start)-\(end)/\(total)"
                headers["Content-Length"] = "\(end - start + 1)"
            } else {
                start = 0
                end = total - 1
            }
        }

        guard let response = HTTPURLResponse(url: url, statusCode: status, httpVersion: "HTTP/1.1",
                                             headerFields: headers) else {
            throw ProbeError.invalid("无法构造音频响应")
        }
        task.didReceive(response)
        guard method != "HEAD", total > 0 else {
            task.didFinish()
            return
        }

        let handle = try FileHandle(forReadingFrom: file)
        defer { try? handle.close() }
        try handle.seek(toOffset: UInt64(start))
        var remaining = end - start + 1
        while remaining > 0 {
            let chunk = try handle.read(upToCount: Int(min(remaining, 256 * 1024))) ?? Data()
            if chunk.isEmpty { break }
            task.didReceive(chunk)
            remaining -= Int64(chunk.count)
        }
        task.didFinish()
    }

    private static let placeholderCoverSvg = """
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><rect width="320" height="320" rx="24" fill="#e9eef5"/><circle cx="160" cy="148" r="54" fill="#c9d6e6"/><path d="M146 182V116l54-13v66" fill="none" stroke="#8fa7c4" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="134" cy="188" r="14" fill="#8fa7c4"/><circle cx="188" cy="174" r="14" fill="#8fa7c4"/></svg>
    """
}
