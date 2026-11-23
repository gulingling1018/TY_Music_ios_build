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

    /// 匿名视频搜索，字段对齐 Android BiliService：只保留 2-5 分钟并按播放量排序。
    func searchVideos(_ keyword: String) async throws -> [[String: Any]] {
        let trimmed = keyword.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty, trimmed.count <= 100 else {
            throw ProbeError.invalid("请输入1-100字的搜索关键词")
        }
        let data = try await api(
            path: "/x/web-interface/search/type",
            query: ["search_type": "video", "keyword": trimmed, "page": "1"],
            referer: "https://search.bilibili.com/",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
        )
        guard let results = data["result"] as? [[String: Any]] else { return [] }
        var videos: [[String: Any]] = []
        for item in results {
            let duration = item["duration"] as? String ?? ""
            let seconds = Self.durationSeconds(duration)
            guard (120...300).contains(seconds) else { continue }

            let rawTitle = item["title"] as? String ?? ""
            let title = Self.decodeEntities(rawTitle.replacingOccurrences(of: "<[^>]+>", with: "", options: .regularExpression))
                .trimmingCharacters(in: .whitespacesAndNewlines)
            guard !title.isEmpty else { continue }

            var cover = item["pic"] as? String ?? ""
            if cover.hasPrefix("//") { cover = "https:" + cover }
            let bvid = item["bvid"] as? String ?? ""
            guard !bvid.isEmpty else { continue }
            // 搜索接口的 arcurl 可能是 http；统一用 HTTPS 规范地址，交给解析器重新解析。
            let url = "https://www.bilibili.com/video/\(bvid)"
            let play = (item["play"] as? NSNumber)?.intValue ?? Int(item["play"] as? String ?? "") ?? 0
            videos.append([
                "title": title,
                "url": url,
                "cover": cover,
                "pic": cover,
                "duration": duration,
                "play": play,
                "author": item["author"] as? String ?? "",
                "bvid": bvid
            ])
        }
        videos.sort { (($0["play"] as? Int) ?? 0) > (($1["play"] as? Int) ?? 0) }
        return Array(videos.prefix(40))
    }

    private static func durationSeconds(_ raw: String) -> Int {
        let parts = raw.split(separator: ":").compactMap { Int($0) }
        switch parts.count {
        case 2: return parts[0] * 60 + parts[1]
        case 3: return parts[0] * 3600 + parts[1] * 60 + parts[2]
        default: return 0
        }
    }

    private static func decodeEntities(_ text: String) -> String {
        var result = text
        let entities = ["&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&#39;": "'", "&#34;": "\""]
        for (key, value) in entities { result = result.replacingOccurrences(of: key, with: value) }
        return result
    }

    private func api(path: String, query: [String: String],
                     referer: String = "https://www.bilibili.com/",
                     userAgent: String = "Mozilla/5.0 TYMusic-iOS-Probe") async throws -> [String: Any] {
        var components = URLComponents()
        components.scheme = "https"
        components.host = "api.bilibili.com"
        components.path = path
        components.queryItems = query.sorted { $0.key < $1.key }.map { URLQueryItem(name: $0.key, value: $0.value) }
        guard let url = components.url else { throw ProbeError.invalid("无法构造媒体请求") }
        var request = URLRequest(url: url)
        request.setValue(userAgent, forHTTPHeaderField: "User-Agent")
        request.setValue(referer, forHTTPHeaderField: "Referer")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
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
