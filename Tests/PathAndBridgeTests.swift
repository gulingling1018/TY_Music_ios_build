import XCTest
@testable import TYMusicProbe

final class PathAndBridgeTests: XCTestCase {
    func testTraversalAndSiblingRootAreRejected() throws {
        let root = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(UUID().uuidString)
        for value in ["../outside", "/etc/passwd", "Music/../../outside", "Music\\..\\outside", "\0"] {
            XCTAssertThrowsError(try PathPolicy.resolve(value, within: root))
        }
        let path = try PathPolicy.resolve("Music/中文 文件%20.m4a", within: root)
        XCTAssertTrue(path.path.hasSuffix("/Music/中文 文件%20.m4a"))
    }

    func testSymbolicLinkEscapeIsRejected() throws {
        let temporary = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        let root = temporary.appendingPathComponent("allowed")
        let outside = temporary.appendingPathComponent("outside")
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        try FileManager.default.createDirectory(at: outside, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: temporary) }
        try FileManager.default.createSymbolicLink(at: root.appendingPathComponent("escape"), withDestinationURL: outside)
        XCTAssertThrowsError(try PathPolicy.resolve("escape/private.m4a", within: root))
    }

    func testOriginAndMalformedMessagesAreRejected() throws {
        XCTAssertTrue(PathPolicy.trustedPage(URL(string: "tymusic://app/index.html")))
        for origin in ["https://app/index.html", "tymusic://evil/index.html", "tymusic://app.evil/", "tymusic://user@app/", "tymusic://app:80/"] {
            XCTAssertFalse(PathPolicy.trustedPage(URL(string: origin)))
        }
        let valid: [String: Any] = ["protocolVersion": 1, "id": "r1", "operation": "playback.next", "body": [:]]
        XCTAssertEqual(try NativeRequest(valid).operation, "playback.next")
        var wrong = valid
        wrong["protocolVersion"] = true
        XCTAssertThrowsError(try NativeRequest(wrong))
        wrong = valid
        wrong["body"] = ["url": String(repeating: "中", count: 30000)]
        XCTAssertThrowsError(try NativeRequest(wrong))
    }

    func testAtomicStoreRejectsCorruptionAndPreservesUnicode() throws {
        let folder = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        defer { try? FileManager.default.removeItem(at: folder) }
        let store = AtomicJSONStore<[String]>(url: folder.appendingPathComponent("state.json"))
        XCTAssertNil(try store.load())
        try store.save(["中文", "空 格", "百分号%"])
        XCTAssertEqual(try store.load(), ["中文", "空 格", "百分号%"])
        try Data("broken".utf8).write(to: store.url)
        XCTAssertThrowsError(try store.load())
        try store.save(["恢复后的状态"])
        let preserved = try FileManager.default.contentsOfDirectory(at: folder, includingPropertiesForKeys: nil)
            .filter { $0.lastPathComponent.contains(".corrupt-") }
        XCTAssertEqual(preserved.count, 1)
        XCTAssertEqual(try String(contentsOf: XCTUnwrap(preserved.first), encoding: .utf8), "broken")
    }
}
