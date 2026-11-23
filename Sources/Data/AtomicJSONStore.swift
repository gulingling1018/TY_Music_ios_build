import Foundation

final class AtomicJSONStore<Value: Codable> {
    let url: URL
    private var writeBlocked = false

    init(url: URL) { self.url = url }

    func load() throws -> Value? {
        guard FileManager.default.fileExists(atPath: url.path) else { return nil }
        do { return try JSONDecoder().decode(Value.self, from: Data(contentsOf: url)) }
        catch {
            // 恢复失败时先保留原文件，不能由后续空快照覆盖唯一可恢复数据。
            let backup = url.deletingLastPathComponent().appendingPathComponent(url.lastPathComponent + ".corrupt-" + UUID().uuidString)
            do { try FileManager.default.copyItem(at: url, to: backup) }
            catch {
                writeBlocked = true
                throw ProbeError(code: "STORAGE_RECOVERY", message: "状态读取失败且无法保留原文件，已停止覆盖写入")
            }
            throw error
        }
    }

    func save(_ value: Value) throws {
        guard !writeBlocked else { throw ProbeError(code: "STORAGE_RECOVERY", message: "状态恢复待处理，未覆盖原文件") }
        try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
        try JSONEncoder().encode(value).write(to: url, options: .atomic)
    }
}
