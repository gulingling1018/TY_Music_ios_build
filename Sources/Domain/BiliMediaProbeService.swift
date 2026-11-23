import Foundation

final class BiliMediaProbeService {
    private let session: URLSession

    init() {
        let config = URLSessionConfiguration.ephemeral
        config.timeoutIntervalForRequest = 20
        config.timeoutIntervalForResource = 30
        self.session = URLSession(configuration: config)
    }

    func resolve(_ input: String, page: Int) async throws -> BiliMediaCandidate {
        guard (1...10000).contains(page) else { throw ProbeError.invalid("分P序号无效") }
        let bvid = try BiliMediaParser.videoID(input)
        let view = try await api(path: "/x/web-interface/view", query: ["bvid": bvid])
        guard let pages = view["pages"] as? [[String: Any]], pages.indices.contains(page - 1),
              let cid = (pages[page - 1]["cid"] as? NSNumber)?.int64Value else {
            throw ProbeError.invalid("该视频没有指定分P")
        }
        let play = try await api(path: "/x/player/playurl", query: ["bvid": bvid, "cid": String(cid),
                                                                 "qn": "112", "fnval": "4048", "fnver": "0", "fourk": "1"])
        let title = (view["title"] as? String ?? bvid) + (pages.count > 1 ? " P\(page)" : "")
        return BiliMediaCandidate(title: title, bvid: bvid, cid: cid, page: page,
                                  url: try BiliMediaParser.audioURL(play))
    }

    private func api(path: String, query: [String: String]) async throws -> [String: Any] {
        var components = URLComponents()
        components.scheme = "https"
        components.host = "api.bilibili.com"
        components.path = path
        components.queryItems = query.sorted { $0.key < $1.key }.map { URLQueryItem(name: $0.key, value: $0.value) }
        guard let url = components.url else { throw ProbeError.invalid("无法构造媒体请求") }
        var request = URLRequest(url: url)
        request.setValue("Mozilla/5.0 TYMusic-iOS-Probe", forHTTPHeaderField: "User-Agent")
        request.setValue("https://www.bilibili.com/", forHTTPHeaderField: "Referer")
        let (bytes, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw ProbeError(code: "BILI_HTTP", message: "媒体接口网络响应失败")
        }
        guard let root = try JSONSerialization.jsonObject(with: bytes) as? [String: Any] else {
            throw ProbeError.invalid("媒体接口响应不是JSON对象")
        }
        return try BiliMediaParser.data(root)
    }
}
