import XCTest
@testable import TYMusicProbe

final class PlaybackQueueTests: XCTestCase {
    private func tracks() -> [AudioTrack] {
        (0..<3).map { AudioTrack(id: "track\($0)", title: "歌曲\($0)", relativePath: "Music/\($0).m4a", remoteURL: nil) }
    }

    func testQueueModesAgainstFixtures() throws {
        let url = try XCTUnwrap(Bundle(for: Self.self).url(forResource: "queue-cases", withExtension: "json", subdirectory: "Fixtures"))
        let cases = try JSONSerialization.jsonObject(with: Data(contentsOf: url)) as! [[String: Any]]
        for example in cases {
            var queue = PlaybackQueue()
            try queue.replace(tracks())
            try queue.setMode(PlaybackMode(rawValue: example["mode"] as! String)!, permutation: example["order"] as? [Int])
            var visited = [queue.index]
            for _ in 0..<4 {
                queue.advance(1, automatic: example["automatic"] as! Bool)
                visited.append(queue.index)
            }
            XCTAssertEqual(visited, example["expected"] as? [Int], example["name"] as! String)
        }
    }

    func testInvalidPermutationDoesNotMutateQueue() throws {
        var queue = PlaybackQueue()
        try queue.replace(tracks())
        let revision = queue.revision
        XCTAssertThrowsError(try queue.setMode(.shuffle, permutation: [0, 0, 1]))
        XCTAssertEqual(queue.mode, .list)
        XCTAssertEqual(queue.revision, revision)
    }

    func testDuplicateIdentityRejectedButDistinctPathsRemainSeparate() throws {
        var queue = PlaybackQueue()
        let a = AudioTrack(id: "root1:甲/同名.mp3", title: "同名.mp3", relativePath: "甲/同名.mp3", remoteURL: nil)
        let b = AudioTrack(id: "root1:乙/同名.mp3", title: "同名.mp3", relativePath: "乙/同名.mp3", remoteURL: nil)
        try queue.replace([a, b])
        XCTAssertEqual(queue.tracks.count, 2)
        XCTAssertThrowsError(try queue.replace([a, a]))
        XCTAssertEqual(queue.tracks, [a, b])
    }

    func testRestoredStateKeepsIndexOrderAndPosition() throws {
        var queue = PlaybackQueue()
        try queue.replace(tracks())
        try queue.setMode(.shuffle, permutation: [2, 0, 1])
        queue.advance(-1)
        queue.positionMs = 12345
        let restored = try JSONDecoder().decode(PlaybackQueue.self, from: JSONEncoder().encode(queue))
        try restored.validate()
        XCTAssertEqual(restored.index, queue.index)
        XCTAssertEqual(restored.order, [2, 0, 1])
        XCTAssertEqual(restored.positionMs, 12345)
    }
}
