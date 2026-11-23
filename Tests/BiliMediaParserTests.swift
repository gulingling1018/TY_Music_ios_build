import XCTest
@testable import TYMusicProbe

final class BiliMediaParserTests: XCTestCase {
    func testActualHostIsRequired() throws {
        XCTAssertEqual(try BiliMediaParser.videoID("https://www.bilibili.com/video/BV1234567890?p=2"), "BV1234567890")
        XCTAssertThrowsError(try BiliMediaParser.videoID("https://bilibili.com.evil.test/video/BV1234567890"))
        XCTAssertThrowsError(try BiliMediaParser.videoID("https://b23.tv/example"))
    }

    func testAudioSelectionAliasesBandwidthAndUnsupportedVideo() throws {
        let play: [String: Any] = ["dash": ["audio": [
            ["bandwidth": 64000, "baseUrl": "https://media.example/low.m4a"],
            ["bandwidth": 192000, "base_url": "https://media.example/high.m4a"]
        ]]]
        XCTAssertEqual(try BiliMediaParser.audioURL(play).lastPathComponent, "high.m4a")
        XCTAssertThrowsError(try BiliMediaParser.audioURL(["durl": [["url": "https://media.example/part1.flv"]]]))
        XCTAssertThrowsError(try BiliMediaParser.data(["code": -101, "message": "account"] ))
    }
}
