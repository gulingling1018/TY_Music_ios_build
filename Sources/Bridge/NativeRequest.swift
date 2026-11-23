import Foundation
import CoreFoundation

struct NativeRequest {
    let id: String
    let operation: String
    let body: [String: Any]

    init(_ value: Any) throws {
        guard let payload = value as? [String: Any],
              let version = payload["protocolVersion"] as? NSNumber,
              CFGetTypeID(version) != CFBooleanGetTypeID(), version.doubleValue == 1,
              let id = payload["id"] as? String, !id.isEmpty, id.count <= 128,
              let operation = payload["operation"] as? String, !operation.isEmpty, operation.count <= 64,
              let body = payload["body"] as? [String: Any],
              let encoded = try? JSONSerialization.data(withJSONObject: payload), encoded.count <= 64 * 1024 else {
            throw ProbeError.invalid("无效桥接消息")
        }
        self.id = id
        self.operation = operation
        self.body = body
    }
}
