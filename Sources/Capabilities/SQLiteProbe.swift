import Foundation
import SQLite3

enum SQLiteProbe {
    static func inspect(bundle: Bundle = .main) -> [String: Any] {
        var result: [String: Any] = ["version": String(cString: sqlite3_libversion())]
        var memory: OpaquePointer?
        if sqlite3_open(":memory:", &memory) == SQLITE_OK {
            result["fts4"] = sqlite3_exec(memory, "CREATE VIRTUAL TABLE probe4 USING fts4(value, tokenize=unicode61)", nil, nil, nil) == SQLITE_OK
            result["fts5"] = sqlite3_exec(memory, "CREATE VIRTUAL TABLE probe5 USING fts5(value, tokenize='unicode61 remove_diacritics 2')", nil, nil, nil) == SQLITE_OK
        }
        if memory != nil { sqlite3_close(memory) }
        guard let base = bundle.resourceURL else { return result }
        let file = base.appendingPathComponent("Resources/SearchData/music_cache.db")
        guard FileManager.default.fileExists(atPath: file.path) else {
            result["bundledDatabase"] = "not_staged"
            return result
        }
        var db: OpaquePointer?
        guard sqlite3_open_v2(file.path, &db, SQLITE_OPEN_READONLY, nil) == SQLITE_OK else {
            if db != nil { sqlite3_close(db) }
            result["bundledDatabase"] = "open_failed"
            return result
        }
        defer { sqlite3_close(db) }
        result["bundledDatabase"] = "opened_readonly"
        var statement: OpaquePointer?
        if sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM songs", -1, &statement, nil) == SQLITE_OK {
            if sqlite3_step(statement) == SQLITE_ROW { result["songs"] = sqlite3_column_int64(statement, 0) }
        } else { result["songsQuery"] = "failed" }
        sqlite3_finalize(statement)
        statement = nil
        if sqlite3_prepare_v2(db, "SELECT rowid FROM songs_fts LIMIT 1", -1, &statement, nil) == SQLITE_OK {
            let status = sqlite3_step(statement)
            result["bundledFTSReadable"] = status == SQLITE_ROW || status == SQLITE_DONE
        } else { result["bundledFTSReadable"] = false }
        sqlite3_finalize(statement)
        return result
    }
}
