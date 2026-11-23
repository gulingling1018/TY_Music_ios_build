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
        tracks.compactMap { track in
            guard let relative = track.relativePath else { return nil }
            let title = (track.title as NSString).deletingPathExtension
            let encoded = relative.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
            return [
                "id": track.id,
                "hash_id": track.id,
                "title": title.isEmpty ? track.title : title,
                "artist": "",
                "album": "",
                "duration": 0,
                "src": "/api/stream_local?path=\(encoded)",
                "audio_local_path": relative,
                "local_media_id": track.id
            ]
        }
    }
}
