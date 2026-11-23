import WebKit
import UniformTypeIdentifiers

final class BundledSchemeHandler: NSObject, WKURLSchemeHandler {
    private let root: URL
    init(root: URL) { self.root = root }

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        do {
            guard let url = urlSchemeTask.request.url, PathPolicy.trustedPage(url),
                  urlSchemeTask.request.httpMethod == "GET" else { throw ProbeError.invalid("不支持的资源请求") }
            // 前端直接 <img src="/api/cover/..."> 的请求走这里；第一阶段统一返回内置占位封面。
            if url.path.hasPrefix("/api/cover/") {
                let data = Data(Self.placeholderCoverSvg.utf8)
                urlSchemeTask.didReceive(URLResponse(url: url, mimeType: "image/svg+xml",
                                                     expectedContentLength: data.count, textEncodingName: "utf-8"))
                urlSchemeTask.didReceive(data)
                urlSchemeTask.didFinish()
                return
            }
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

    private static let placeholderCoverSvg = """
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><rect width="320" height="320" rx="24" fill="#e9eef5"/><circle cx="160" cy="148" r="54" fill="#c9d6e6"/><path d="M146 182V116l54-13v66" fill="none" stroke="#8fa7c4" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="134" cy="188" r="14" fill="#8fa7c4"/><circle cx="188" cy="174" r="14" fill="#8fa7c4"/></svg>
    """
}
