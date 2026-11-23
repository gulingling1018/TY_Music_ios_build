import Foundation

final class MediaFileStore {
    let root: URL

    init(root: URL) throws {
        self.root = root
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
    }

    func url(for track: AudioTrack) throws -> URL {
        if let path = track.relativePath {
            let file = try PathPolicy.resolve(path, within: root)
            guard FileManager.default.fileExists(atPath: file.path) else {
                throw ProbeError(code: "FILE_MISSING", message: "本地音频已不存在，请重新导入")
            }
            return file
        }
        if let url = track.remoteURL { return try PathPolicy.networkURL(url.absoluteString) }
        throw ProbeError.invalid("歌曲缺少可访问音频")
    }

    func importFile(_ source: URL) throws -> AudioTrack {
        let ext = source.pathExtension.lowercased()
        guard ["mp3", "m4a", "mp4", "aac", "wav", "aiff", "caf", "flac"].contains(ext) else {
            throw ProbeError.invalid("此原型暂不接受该音频扩展名")
        }
        let id = UUID().uuidString
        let relative = "Music/\(id).\(ext)"
        let target = try PathPolicy.resolve(relative, within: root)
        try FileManager.default.createDirectory(at: target.deletingLastPathComponent(), withIntermediateDirectories: true)
        var coordinationError: NSError?
        var copyError: Error?
        NSFileCoordinator().coordinate(readingItemAt: source, options: [], error: &coordinationError) { readable in
            do { try FileManager.default.copyItem(at: readable, to: target) }
            catch { copyError = error }
        }
        if let error = coordinationError { throw error }
        if let error = copyError { throw error }
        return AudioTrack(id: id, title: source.lastPathComponent, relativePath: relative, remoteURL: nil)
    }
}
