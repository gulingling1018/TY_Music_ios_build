import Foundation
import SQLite3

private let sqliteTransient = unsafeBitCast(-1, to: sqlite3_destructor_type.self)

/// 只读查询打包的离线搜索库。没有分片时抛 SEARCH_DB_NOT_STAGED，由上层回退到本地导入库。
@MainActor
final class OfflineSearchService {
    private let store: SearchDatabaseStore

    init(store: SearchDatabaseStore) {
        self.store = store
    }

    func search(_ keyword: String, page: Int, limit: Int) async throws -> (songs: [[String: Any]], total: Int, hasMore: Bool) {
        let database = try await store.databaseURL()
        let query = keyword.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !query.isEmpty else { return ([], 0, false) }
        let safePage = max(1, page)
        let safeLimit = min(100, max(1, limit))
        return try await Task.detached(priority: .userInitiated) {
            try Self.search(database: database, keyword: query, page: safePage, limit: safeLimit)
        }.value
    }

    func songURL(hashId: String) async throws -> String? {
        let database = try await store.databaseURL()
        return try await Task.detached(priority: .userInitiated) {
            try Self.songURL(database: database, hashId: hashId)
        }.value
    }

    private static func open(_ url: URL) throws -> OpaquePointer {
        var db: OpaquePointer?
        guard sqlite3_open_v2(url.path, &db, SQLITE_OPEN_READONLY, nil) == SQLITE_OK, let db else {
            if db != nil { sqlite3_close(db) }
            throw ProbeError(code: "SEARCH_DB_OPEN", message: "离线搜索库打开失败")
        }
        return db
    }

    private static func search(database: URL, keyword: String, page: Int, limit: Int) throws
        -> (songs: [[String: Any]], total: Int, hasMore: Bool) {
        let db = try open(database)
        defer { sqlite3_close(db) }

        let escaped = keyword
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "%", with: "\\%")
            .replacingOccurrences(of: "_", with: "\\_")
        let pattern = "%\(escaped)%"
        let whereClause = "(title_search LIKE ? ESCAPE '\\' OR artist_search LIKE ? ESCAPE '\\' OR producer_search LIKE ? ESCAPE '\\')"

        var total = 0
        var countStmt: OpaquePointer?
        if sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM songs WHERE \(whereClause)", -1, &countStmt, nil) == SQLITE_OK {
            bind(countStmt, 1, pattern)
            bind(countStmt, 2, pattern)
            bind(countStmt, 3, pattern)
            if sqlite3_step(countStmt) == SQLITE_ROW {
                total = Int(sqlite3_column_int64(countStmt, 0))
            }
        }
        sqlite3_finalize(countStmt)

        let offset = (page - 1) * limit
        var stmt: OpaquePointer?
        let sql = """
        SELECT hash_id, title, artist, producer, duration, json
        FROM songs
        WHERE \(whereClause)
        ORDER BY title
        LIMIT ? OFFSET ?
        """
        var songs: [[String: Any]] = []
        if sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK {
            bind(stmt, 1, pattern)
            bind(stmt, 2, pattern)
            bind(stmt, 3, pattern)
            sqlite3_bind_int(stmt, 4, Int32(limit))
            sqlite3_bind_int(stmt, 5, Int32(offset))
            while sqlite3_step(stmt) == SQLITE_ROW {
                songs.append(Self.song(from: stmt))
            }
        }
        sqlite3_finalize(stmt)
        return (songs, total, offset + songs.count < total)
    }

    private static func song(from stmt: OpaquePointer?) -> [String: Any] {
        let hashId = text(stmt, 0) ?? ""
        var song: [String: Any] = [:]
        if let raw = text(stmt, 5), let data = raw.data(using: .utf8),
           let parsed = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            song = parsed
        }
        song["hash_id"] = hashId
        song["id"] = hashId
        song["title"] = text(stmt, 1) ?? song["title"] ?? ""
        song["artist"] = text(stmt, 2) ?? song["artist"] ?? ""
        song["producer"] = text(stmt, 3) ?? song["producer"] ?? ""
        song["duration"] = Int(sqlite3_column_int64(stmt, 4))
        let encoded = hashId.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        song["src"] = "/api/stream_remote?hash=\(encoded)"
        song["offline"] = true
        return song
    }

    private static func songURL(database: URL, hashId: String) throws -> String? {
        let db = try open(database)
        defer { sqlite3_close(db) }
        var stmt: OpaquePointer?
        guard sqlite3_prepare_v2(db, "SELECT json FROM songs WHERE hash_id = ? LIMIT 1", -1, &stmt, nil) == SQLITE_OK else {
            return nil
        }
        defer { sqlite3_finalize(stmt) }
        bind(stmt, 1, hashId)
        guard sqlite3_step(stmt) == SQLITE_ROW,
              let raw = text(stmt, 0), let data = raw.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let url = json["url"] as? String else { return nil }
        return url
    }

    private static func bind(_ stmt: OpaquePointer?, _ index: Int32, _ value: String) {
        value.withCString { sqlite3_bind_text(stmt, index, $0, -1, sqliteTransient) }
    }

    private static func text(_ stmt: OpaquePointer?, _ index: Int32) -> String? {
        guard let text = sqlite3_column_text(stmt, index) else { return nil }
        return String(cString: UnsafeRawPointer(text).assumingMemoryBound(to: CChar.self))
    }
}
