import Foundation

/// 把离线库里的 B 站视频地址解析成 DASH 音频，并作为媒体代理转发给 WKWebView 的 <audio>。
@MainActor
final class RemoteStreamProxy {
    private let offline: OfflineSearchService
    private let bili = BiliMediaProbeService()
    private var cache: [String: (url: URL, expires: Date)] = [:]

    init(offline: OfflineSearchService) {
        self.offline = offline
    }

    func fetch(hashId: String, range: String?) async throws -> (status: Int, headers: [String: String], body: Data) {
        let audioURL = try await resolvedURL(hashId: hashId)
        var request = URLRequest(url: audioURL)
        request.setValue("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
                         forHTTPHeaderField: "User-Agent")
        request.setValue("https://www.bilibili.com/", forHTTPHeaderField: "Referer")
        if let range, !range.isEmpty {
            request.setValue(range, forHTTPHeaderField: "Range")
        }
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw ProbeError(code: "STREAM_RESPONSE", message: "音频代理响应无效")
        }
        var headers: [String: String] = [
            "Content-Type": http.value(forHTTPHeaderField: "Content-Type") ?? "audio/mp4",
            "Accept-Ranges": "bytes",
            "Content-Length": "\(data.count)",
            "Cache-Control": "no-store"
        ]
        if let contentRange = http.value(forHTTPHeaderField: "Content-Range") {
            headers["Content-Range"] = contentRange
        }
        return (http.statusCode, headers, data)
    }

    private func resolvedURL(hashId: String) async throws -> URL {
        if let cached = cache[hashId], cached.expires > Date() {
            return cached.url
        }
        guard let video = try await offline.songURL(hashId: hashId) else {
            throw ProbeError(code: "STREAM_SOURCE", message: "离线库中没有该歌曲地址")
        }
        let page = Self.page(from: video)
        let candidate = try await bili.resolve(video, page: page)
        cache[hashId] = (candidate.url, Date().addingTimeInterval(300))
        return candidate.url
    }

    private static func page(from raw: String) -> Int {
        guard let components = URLComponents(string: raw),
              let value = components.queryItems?.first(where: { $0.name == "p" })?.value,
              let page = Int(value), (1...10000).contains(page) else {
            return 1
        }
        return page
    }
}
