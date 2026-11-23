import Foundation

@MainActor
final class ProbeRuntime {
    let files: MediaFileStore
    let playback: NativePlaybackService
    let downloads: ProbeDownloadService
    let importer: AudioImportController
    let router: ProbeRouter

    init() throws {
        let support = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask,
                                                  appropriateFor: nil, create: true).appendingPathComponent("TYMusicProbe", isDirectory: true)
        let files = try MediaFileStore(root: support)
        let playback = NativePlaybackService(files: files, stateURL: support.appendingPathComponent("playback-v1.json"))
        let downloads = ProbeDownloadService(root: support, stateURL: support.appendingPathComponent("downloads-v1.json"))
        let importer = AudioImportController(files: files)
        self.files = files
        self.playback = playback
        self.downloads = downloads
        self.importer = importer
        self.router = ProbeRouter(playback: playback, downloads: downloads, importer: importer)
        downloads.restore()
    }
}
