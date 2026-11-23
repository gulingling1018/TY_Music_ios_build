import CryptoKit
import Foundation

struct SearchDatabaseManifest: Codable {
    struct Part: Codable {
        let name: String
        let size: Int
        let sha256: String
    }

    let source: String
    let totalBytes: Int
    let sha256: String
    let parts: [Part]
}

/// 把打包进 App 的搜索库分片拼接到 Application Support，并做 SHA256 校验。
@MainActor
final class SearchDatabaseStore {
    private let partsDirectory: URL
    private let targetURL: URL
    private var readyURL: URL?
    private var task: Task<URL, Error>?

    init(bundle: Bundle = .main, support: URL) {
        partsDirectory = bundle.resourceURL?
            .appendingPathComponent("AppAssets/SearchDataParts", isDirectory: true)
            ?? URL(fileURLWithPath: "/nonexistent")
        targetURL = support.appendingPathComponent("SearchData/music_cache.db")
    }

    func databaseURL() async throws -> URL {
        if let readyURL { return readyURL }
        if let task { return try await task.value }

        let parts = partsDirectory
        let target = targetURL
        let task = Task.detached(priority: .utility) {
            try Self.assemble(partsDirectory: parts, targetURL: target)
        }
        self.task = task
        do {
            let url = try await task.value
            readyURL = url
            self.task = nil
            return url
        } catch {
            self.task = nil
            throw error
        }
    }

    private nonisolated static func assemble(partsDirectory: URL, targetURL: URL) throws -> URL {
        let manifestURL = partsDirectory.appendingPathComponent("manifest.json")
        guard let manifestData = try? Data(contentsOf: manifestURL),
              let manifest = try? JSONDecoder().decode(SearchDatabaseManifest.self, from: manifestData) else {
            throw ProbeError(code: "SEARCH_DB_NOT_STAGED", message: "离线搜索库未内置")
        }
        if let values = try? targetURL.resourceValues(forKeys: [.fileSizeKey]),
           values.fileSize == manifest.totalBytes {
            return targetURL
        }

        let manager = FileManager.default
        try manager.createDirectory(at: targetURL.deletingLastPathComponent(), withIntermediateDirectories: true)
        let tempURL = targetURL.deletingLastPathComponent()
            .appendingPathComponent("music_cache.db.tmp-\(UUID().uuidString)")
        manager.createFile(atPath: tempURL.path, contents: nil)
        guard let output = try? FileHandle(forWritingTo: tempURL) else {
            throw ProbeError(code: "SEARCH_DB_WRITE", message: "无法写入离线搜索库")
        }

        var totalHasher = SHA256()
        do {
            for part in manifest.parts {
                let partURL = partsDirectory.appendingPathComponent(part.name)
                let handle = try FileHandle(forReadingFrom: partURL)
                defer { try? handle.close() }
                var partHasher = SHA256()
                var written = 0
                while let chunk = try handle.read(upToCount: 1024 * 1024), !chunk.isEmpty {
                    partHasher.update(data: chunk)
                    totalHasher.update(data: chunk)
                    try output.write(contentsOf: chunk)
                    written += chunk.count
                }
                let partHash = partHasher.finalize().map { String(format: "%02x", $0) }.joined()
                guard written == part.size, partHash == part.sha256 else {
                    throw ProbeError(code: "SEARCH_DB_CORRUPT", message: "离线搜索库分片校验失败")
                }
            }
            try output.close()
            let totalHash = totalHasher.finalize().map { String(format: "%02x", $0) }.joined()
            guard totalHash == manifest.sha256 else {
                throw ProbeError(code: "SEARCH_DB_CORRUPT", message: "离线搜索库总校验失败")
            }
            if manager.fileExists(atPath: targetURL.path) {
                _ = try manager.replaceItemAt(targetURL, withItemAt: tempURL)
            } else {
                try manager.moveItem(at: tempURL, to: targetURL)
            }
            return targetURL
        } catch {
            try? output.close()
            try? manager.removeItem(at: tempURL)
            throw error
        }
    }
}
