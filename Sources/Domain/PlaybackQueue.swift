import Foundation

struct AudioTrack: Codable, Equatable {
    let id: String
    let title: String
    let relativePath: String?
    let remoteURL: URL?
}

enum PlaybackMode: String, Codable {
    case list = "loop_list"
    case single = "loop_single"
    case shuffle = "shuffle"
}

struct PlaybackQueue: Codable {
    var tracks: [AudioTrack] = []
    var index = 0
    var mode: PlaybackMode = .list
    var order: [Int] = []
    var positionMs = 0.0
    var revision = 0

    var current: AudioTrack? { tracks.indices.contains(index) ? tracks[index] : nil }

    func validate() throws {
        guard tracks.count <= 1000, Set(tracks.map(\.id)).count == tracks.count,
              tracks.allSatisfy({ !$0.id.isEmpty && $0.id.count <= 256 && !$0.title.isEmpty }),
              (tracks.isEmpty ? index == 0 : tracks.indices.contains(index)),
              Set(order) == Set(tracks.indices), order.count == tracks.count,
              positionMs.isFinite, positionMs >= 0, revision >= 0 else {
            throw ProbeError.invalid("队列、索引、随机置换或进度无效")
        }
    }

    mutating func replace(_ values: [AudioTrack], selected: Int = 0) throws {
        var next = PlaybackQueue(tracks: values, index: selected, mode: mode,
                                 order: Array(values.indices), revision: revision + 1)
        if mode == .shuffle { next.order.shuffle() }
        try next.validate()
        self = next
    }

    mutating func setMode(_ value: PlaybackMode, permutation: [Int]? = nil) throws {
        var next = self
        next.mode = value
        if value == .shuffle { next.order = permutation ?? Array(tracks.indices).shuffled() }
        next.revision += 1
        try next.validate()
        self = next
    }

    mutating func advance(_ step: Int, automatic: Bool = false) {
        guard !tracks.isEmpty else { return }
        if !(automatic && mode == .single) {
            let sequence = mode == .shuffle ? order : Array(tracks.indices)
            let cursor = sequence.firstIndex(of: index) ?? 0
            index = sequence[(cursor + (step % sequence.count) + sequence.count) % sequence.count]
        }
        positionMs = 0
        revision += 1
    }
}
