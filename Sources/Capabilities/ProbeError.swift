import Foundation

struct ProbeError: LocalizedError {
    let code: String
    let message: String
    var errorDescription: String? { message }

    static func invalid(_ message: String) -> ProbeError {
        ProbeError(code: "INVALID_ARGUMENT", message: message)
    }
}

extension Encodable {
    func jsonObject() throws -> Any {
        try JSONSerialization.jsonObject(with: JSONEncoder().encode(self))
    }
}
