import Foundation

/// 本地导入音乐的持久索引。只保存文件相对路径，实际文件位于 MediaFileStore.root。
@MainActor
final class LocalMusicLibrary {
    private let store: AtomicJSONStore<[AudioTrack]>
    private(set) var tracks: [AudioTrack] = []

    init(stateURL: URL) {
        store = AtomicJSONStore(url: stateURL)
        do {
            tracks = try store.load() ?? []
        } catch {
            tracks = []
        }
        if tracks.count > 1000 { tracks = Array(tracks.prefix(1000)) }
    }

    @discardableResult
    func add(_ newTracks: [AudioTrack]) throws -> Int {
        let existing = Set(tracks.map(\.id))
        var appended: [AudioTrack] = []
        for track in newTracks where !existing.contains(track.id) {
            guard tracks.count + appended.count < 1000 else { break }
            appended.append(track)
        }
        guard !appended.isEmpty else { return 0 }
        let next = tracks + appended
        try store.save(next)
        tracks = next
        return appended.count
    }

    /// 转成前端 `/api/playlist/local_music` 需要的歌曲结构。
    func songPayload() -> [[String: Any]] {
        tracks.compactMap { Self.payload(for: $0) }
    }

    /// 标题搜索（已导入本地音乐）。分页字段对齐前端 `/api/search` 契约。
    func search(_ keyword: String, page: Int, limit: Int) -> (songs: [[String: Any]], total: Int, hasMore: Bool) {
        let query = keyword.trimmingCharacters(in: .whitespacesAndNewlines)
        let matches = query.isEmpty ? tracks : tracks.filter { track in
            Self.displayTitle(track).localizedCaseInsensitiveContains(query)
                || track.title.localizedCaseInsensitiveContains(query)
        }
        let sorted = matches.sorted { lhs, rhs in
            let left = Self.displayTitle(lhs)
            let right = Self.displayTitle(rhs)
            let order = left.localizedStandardCompare(right)
            if order == .orderedSame { return lhs.id < rhs.id }
            return order == .orderedAscending
        }
        let safeLimit = min(max(limit, 1), 100)
        let safePage = max(page, 1)
        let start = (safePage - 1) * safeLimit
        let end = min(start + safeLimit, sorted.count)
        let slice = start < end ? Array(sorted[start..<end]) : []
        return (slice.compactMap { Self.payload(for: $0) }, sorted.count, end < sorted.count)
    }

    private static func displayTitle(_ track: AudioTrack) -> String {
        let title = (track.title as NSString).deletingPathExtension
        return title.isEmpty ? track.title : title
    }

    static func payload(for track: AudioTrack) -> [String: Any]? {
        guard let relative = track.relativePath else { return nil }
        let encoded = relative.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        return [
            "id": track.id,
            "hash_id": track.id,
            "title": displayTitle(track),
            "artist": "",
            "album": "",
            "duration": 0,
            "src": "/api/stream_local?path=\(encoded)",
            "audio_local_path": relative,
            "local_media_id": track.id
        ]
    }
}
