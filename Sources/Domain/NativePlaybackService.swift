import AVFoundation
import MediaPlayer

@MainActor
final class NativePlaybackService {
    private let player = AVPlayer()
    private let files: MediaFileStore
    private let store: AtomicJSONStore<PlaybackQueue>
    private(set) var queue = PlaybackQueue()
    private var periodicObserver: Any?
    private var observations: [NSKeyValueObservation] = []
    private var notifications: [NSObjectProtocol] = []
    private var remoteTargets: [(MPRemoteCommand, Any)] = []
    private let sessionID = UUID().uuidString
    private var sequence = 0
    private var lastSavedAt = Date.distantPast
    private var resumeAfterInterruption = false
    private var loadGeneration = 0
    private var playIntent = false
    private var lastError: String?
    private var persistenceError: String?
    var onSnapshot: (([String: Any]) -> Void)?

    init(files: MediaFileStore, stateURL: URL) {
        self.files = files
        self.store = AtomicJSONStore(url: stateURL)
        do {
            if let restored = try store.load() {
                try restored.validate()
                queue = restored
            }
        } catch { persistenceError = "队列恢复失败：\(error.localizedDescription)" }
        player.actionAtItemEnd = .pause
        observations.append(player.observe(\.timeControlStatus, options: [.new]) { [weak self] _, _ in
            Task { @MainActor in self?.publish() }
        })
        periodicObserver = player.addPeriodicTimeObserver(forInterval: CMTime(seconds: 1, preferredTimescale: 600), queue: .main) { [weak self] _ in
            Task { @MainActor in
                guard let self else { return }
                self.updatePosition()
                if Date().timeIntervalSince(self.lastSavedAt) >= 5 { self.persist() }
                self.publish()
            }
        }
        observeSystemEvents()
        installRemoteCommands()
    }

    func snapshot() -> [String: Any] {
        let duration = player.currentItem?.duration.seconds ?? 0
        return ["schemaVersion": 1, "sessionId": sessionID, "seqNo": sequence,
                "revision": queue.revision, "index": queue.index, "mode": queue.mode.rawValue,
                "order": queue.order, "positionMs": queue.positionMs,
                "durationMs": duration.isFinite ? max(0, duration * 1000) : 0,
                "isPlaying": player.timeControlStatus == .playing,
                "isWaiting": player.timeControlStatus == .waitingToPlayAtSpecifiedRate,
                "tracks": queue.tracks.map { ["id": $0.id, "title": $0.title, "isLocal": $0.relativePath != nil] as [String: Any] },
                "error": (lastError as Any?) ?? NSNull(), "persistenceError": (persistenceError as Any?) ?? NSNull()]
    }

    func replace(_ tracks: [AudioTrack]) throws {
        for track in tracks { _ = try files.url(for: track) }
        try queue.replace(tracks)
        persist()
        try loadCurrent(autoplay: false)
    }

    func play() throws {
        guard queue.current != nil else { throw ProbeError.invalid("请先导入音频或添加网络音频") }
        if player.currentItem == nil { try loadCurrent(autoplay: false) }
        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.playback, mode: .default)
        try session.setActive(true)
        lastError = nil
        playIntent = true
        player.play()
        publish()
    }

    func pause() {
        resumeAfterInterruption = false
        playIntent = false
        player.pause()
        updatePosition()
        persist()
        publish()
    }

    func step(_ amount: Int, automatic: Bool = false) throws {
        guard queue.current != nil else { throw ProbeError.invalid("队列为空") }
        queue.advance(amount, automatic: automatic)
        persist()
        try loadCurrent(autoplay: true)
    }

    func setMode(_ raw: String) throws {
        guard let mode = PlaybackMode(rawValue: raw) else { throw ProbeError.invalid("未知播放模式") }
        try queue.setMode(mode)
        persist()
        publish()
    }

    func seek(_ milliseconds: Double) throws {
        let duration = player.currentItem?.duration.seconds ?? .nan
        guard milliseconds.isFinite, milliseconds >= 0, duration.isFinite,
              milliseconds <= duration * 1000 else { throw ProbeError.invalid("当前音频尚不可定位或进度超出范围") }
        let generation = loadGeneration
        player.seek(to: CMTime(seconds: milliseconds / 1000, preferredTimescale: 600), toleranceBefore: .zero, toleranceAfter: .zero) { [weak self] finished in
            Task { @MainActor in
                guard let self, finished, self.loadGeneration == generation else { return }
                self.updatePosition()
                self.persist()
                self.publish()
            }
        }
    }

    func checkpoint() {
        updatePosition()
        persist()
    }

    private func loadCurrent(autoplay: Bool) throws {
        loadGeneration += 1
        let generation = loadGeneration
        playIntent = autoplay
        player.pause()
        player.replaceCurrentItem(with: nil)
        guard let track = queue.current else {
            player.replaceCurrentItem(with: nil)
            publish()
            return
        }
        let item = AVPlayerItem(url: try files.url(for: track))
        // player 的观察常驻；歌曲观察随当前 item 释放，避免旧歌曲错误覆盖新歌曲。
        if observations.count > 1 { observations.removeLast() }
        observations.append(item.observe(\.status, options: [.new]) { [weak self] item, _ in
            guard item.status == .failed else { return }
            Task { @MainActor in
                guard let self, self.loadGeneration == generation else { return }
                self.report("音频加载失败，请检查格式、网络或链接有效期")
            }
        })
        player.replaceCurrentItem(with: item)
        let position = queue.positionMs
        if position > 0 {
            player.seek(to: CMTime(seconds: position / 1000, preferredTimescale: 600)) { [weak self] finished in
                Task { @MainActor in
                    guard let self, self.loadGeneration == generation else { return }
                    if autoplay && finished && self.playIntent { self.runCommand { try self.play() } }
                    self.publish()
                }
            }
        } else if autoplay { try play() }
        publish()
    }

    private func updatePosition() {
        let seconds = player.currentTime().seconds
        if player.currentItem != nil && seconds.isFinite { queue.positionMs = max(0, seconds * 1000) }
    }

    private func persist() {
        do {
            try store.save(queue)
            persistenceError = nil
            lastSavedAt = Date()
        } catch { persistenceError = "队列保存失败：\(error.localizedDescription)" }
    }

    private func publish() {
        sequence += 1
        let state = snapshot()
        if let track = queue.current {
            MPNowPlayingInfoCenter.default().nowPlayingInfo = [
                MPMediaItemPropertyTitle: track.title,
                MPMediaItemPropertyPlaybackDuration: (state["durationMs"] as? Double ?? 0) / 1000,
                MPNowPlayingInfoPropertyElapsedPlaybackTime: queue.positionMs / 1000,
                MPNowPlayingInfoPropertyPlaybackRate: player.rate
            ]
        } else { MPNowPlayingInfoCenter.default().nowPlayingInfo = nil }
        onSnapshot?(state)
    }

    private func report(_ message: String) {
        playIntent = false
        player.pause()
        lastError = message
        publish()
    }

    private func runCommand(_ command: () throws -> Void) {
        do { try command() } catch { report(error.localizedDescription) }
    }

    private func observeSystemEvents() {
        let center = NotificationCenter.default
        notifications.append(center.addObserver(forName: .AVPlayerItemDidPlayToEndTime, object: nil, queue: .main) { [weak self] note in
            let item = note.object as? AVPlayerItem
            Task { @MainActor in
                guard let self, item === self.player.currentItem else { return }
                self.runCommand { try self.step(1, automatic: true) }
            }
        })
        notifications.append(center.addObserver(forName: AVAudioSession.interruptionNotification, object: nil, queue: .main) { [weak self] note in
            let info = note.userInfo ?? [:]
            Task { @MainActor in
                guard let self, let raw = info[AVAudioSessionInterruptionTypeKey] as? UInt,
                      let type = AVAudioSession.InterruptionType(rawValue: raw) else { return }
                if type == .began {
                    let wasPlaying = self.player.rate > 0
                    self.pause()
                    self.resumeAfterInterruption = wasPlaying
                } else {
                    let flags = info[AVAudioSessionInterruptionOptionKey] as? UInt ?? 0
                    let resume = self.resumeAfterInterruption && AVAudioSession.InterruptionOptions(rawValue: flags).contains(.shouldResume)
                    self.resumeAfterInterruption = false
                    if resume { self.runCommand { try self.play() } }
                }
            }
        })
        notifications.append(center.addObserver(forName: AVAudioSession.routeChangeNotification, object: nil, queue: .main) { [weak self] note in
            let reason = note.userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt
            if reason == AVAudioSession.RouteChangeReason.oldDeviceUnavailable.rawValue {
                Task { @MainActor in self?.pause() }
            }
        })
    }

    private func installRemoteCommands() {
        let commands = MPRemoteCommandCenter.shared()
        func bind(_ command: MPRemoteCommand, _ action: @escaping @MainActor () throws -> Void) {
            command.isEnabled = true
            let target = command.addTarget { [weak self] _ in
                guard self != nil else { return .commandFailed }
                Task { @MainActor in self?.runCommand(action) }
                return .success
            }
            remoteTargets.append((command, target))
        }
        bind(commands.playCommand) { [weak self] in try self?.play() }
        bind(commands.pauseCommand) { [weak self] in self?.pause() }
        bind(commands.nextTrackCommand) { [weak self] in try self?.step(1) }
        bind(commands.previousTrackCommand) { [weak self] in try self?.step(-1) }
        let seekTarget = commands.changePlaybackPositionCommand.addTarget { [weak self] event in
            guard let event = event as? MPChangePlaybackPositionCommandEvent else { return .commandFailed }
            Task { @MainActor in self?.runCommand { try self?.seek(event.positionTime * 1000) } }
            return .success
        }
        commands.changePlaybackPositionCommand.isEnabled = true
        remoteTargets.append((commands.changePlaybackPositionCommand, seekTarget))
    }
}
