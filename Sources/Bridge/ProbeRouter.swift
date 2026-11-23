import Foundation
import CoreFoundation
import UIKit

@MainActor
final class ProbeRouter {
    private let playback: NativePlaybackService
    private let downloads: ProbeDownloadService
    private let importer: AudioImportController
    private let bili = BiliMediaProbeService()

    init(playback: NativePlaybackService, downloads: ProbeDownloadService, importer: AudioImportController) {
        self.playback = playback
        self.downloads = downloads
        self.importer = importer
    }

    func call(operation: String, body: [String: Any]) async throws -> Any {
        switch operation {
        case "probe.info":
            return ["platform": "ios", "protocolVersion": 1, "stage": "risk_prototype",
                    "systemVersion": UIDevice.current.systemVersion,
                    "capabilities": ["nativeAudio": "unverified", "nativeQueue": "unverified",
                                     "backgroundDownload": "unverified", "biliAnonymousDash": "unverified",
                                     "productionAPI": "not_implemented", "biliLogin": "not_implemented",
                                     "authorizedDirectory": "not_implemented"]]
        case "probe.sqlite":
            return await Task.detached(priority: .utility) { SQLiteProbe.inspect() }.value
        case "probe.importAudio":
            let tracks = try await importer.pick()
            try playback.replace(playback.queue.tracks + tracks)
            return playback.snapshot()
        case "probe.addRemoteAudio":
            let url = try PathPolicy.networkURL(string("url", in: body))
            let title = (body["title"] as? String).flatMap { $0.isEmpty ? nil : $0 } ?? "网络音频"
            let track = AudioTrack(id: UUID().uuidString, title: String(title.prefix(256)), relativePath: nil, remoteURL: url)
            try playback.replace(playback.queue.tracks + [track])
            return playback.snapshot()
        case "playback.snapshot": return playback.snapshot()
        case "playback.play": try playback.play()
        case "playback.pause": playback.pause()
        case "playback.next": try playback.step(1)
        case "playback.previous": try playback.step(-1)
        case "playback.seek":
            guard let value = body["positionMs"] as? NSNumber, CFGetTypeID(value) != CFBooleanGetTypeID() else {
                throw ProbeError.invalid("进度必须是毫秒数")
            }
            try playback.seek(value.doubleValue)
        case "playback.mode": try playback.setMode(string("mode", in: body))
        case "playback.clear": try playback.replace([])
        case "download.snapshot": return try downloads.snapshot()
        case "download.enqueue":
            let url = try PathPolicy.networkURL(string("url", in: body))
            return ["id": try downloads.enqueue(url: url, title: (body["title"] as? String) ?? "下载音频")]
        case "download.fromBili":
            let page = (body["page"] as? NSNumber)?.intValue ?? 1
            let candidate = try await bili.resolve(string("input", in: body), page: page)
            return ["id": try downloads.enqueue(url: candidate.url, title: candidate.title, referer: "https://www.bilibili.com/"),
                    "bvid": candidate.bvid, "cid": candidate.cid, "page": candidate.page]
        case "download.cancel":
            try downloads.cancel(string("id", in: body))
            return try downloads.snapshot()
        case "download.loadCompleted":
            let existing = Set(playback.queue.tracks.map(\.id))
            try playback.replace(playback.queue.tracks + downloads.completedTracks().filter { !existing.contains($0.id) })
        default:
            throw ProbeError(code: "NOT_IMPLEMENTED", message: "此原型尚未实现该能力")
        }
        return playback.snapshot()
    }

    private func string(_ key: String, in body: [String: Any]) throws -> String {
        guard let value = body[key] as? String, !value.isEmpty, value.count <= 8192 else {
            throw ProbeError.invalid("缺少或无效参数：\(key)")
        }
        return value
    }
}
