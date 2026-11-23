import AVFoundation
import Foundation

@MainActor
final class ProbeRuntime {
    let files: MediaFileStore
    let library: LocalMusicLibrary
    let playback: NativePlaybackService
    let downloads: ProbeDownloadService
    let importer: AudioImportController
    let router: ProbeRouter
    let searchDatabase: SearchDatabaseStore
    let offlineSearch: OfflineSearchService
    let streamProxy: RemoteStreamProxy

    init() throws {
        let support = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask,
                                                  appropriateFor: nil, create: true).appendingPathComponent("TYMusicProbe", isDirectory: true)
        let files = try MediaFileStore(root: support)
        let library = LocalMusicLibrary(stateURL: support.appendingPathComponent("local-library-v1.json"))
        let searchDatabase = SearchDatabaseStore(support: support)
        let offlineSearch = OfflineSearchService(store: searchDatabase)
        let streamProxy = RemoteStreamProxy(offline: offlineSearch)
        let playback = NativePlaybackService(files: files, stateURL: support.appendingPathComponent("playback-v1.json"))
        let downloads = ProbeDownloadService(root: support, stateURL: support.appendingPathComponent("downloads-v1.json"))
        let importer = AudioImportController(files: files)
        self.files = files
        self.library = library
        self.playback = playback
        self.downloads = downloads
        self.importer = importer
        self.router = ProbeRouter(playback: playback, downloads: downloads, importer: importer)
        self.searchDatabase = searchDatabase
        self.offlineSearch = offlineSearch
        self.streamProxy = streamProxy
        downloads.restore()
        // 让 WKWebView 的音频在锁屏/后台继续播放。
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
        // 首启后台拼接离线搜索库，避免第一次搜索等待。
        Task { _ = try? await searchDatabase.databaseURL() }
    }
}
