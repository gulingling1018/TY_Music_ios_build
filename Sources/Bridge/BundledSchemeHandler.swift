import WebKit
import UniformTypeIdentifiers

final class BundledSchemeHandler: NSObject, WKURLSchemeHandler {
    private let root: URL
    init(root: URL) { self.root = root }

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        do {
            guard let url = urlSchemeTask.request.url, PathPolicy.trustedPage(url),
                  urlSchemeTask.request.httpMethod == "GET" else { throw ProbeError.invalid("不支持的资源请求") }
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
}
