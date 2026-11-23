import Foundation

struct BiliMediaCandidate {
    let title: String
    let bvid: String
    let cid: Int64
    let page: Int
    let url: URL
}

enum BiliMediaParser {
    // 对照Android BiliMediaParseFunctionLibrary；仅做解析，不执行传输或落盘。
    static func videoID(_ raw: String) throws -> String {
        let input = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        if input.range(of: "^BV[0-9A-Za-z]{10}$", options: .regularExpression) != nil { return input }
        let url = try PathPolicy.networkURL(input)
        guard let host = url.host?.lowercased(), host == "bilibili.com" || host.hasSuffix(".bilibili.com") else {
            throw ProbeError.invalid("此原型接受BV号或完整bilibili.com视频地址，短链接待适配")
        }
        for part in url.pathComponents {
            if part.range(of: "^BV[0-9A-Za-z]{10}$", options: .regularExpression) != nil { return part }
        }
        throw ProbeError.invalid("视频地址中没有有效BV号")
    }

    static func data(_ root: [String: Any]) throws -> [String: Any] {
        guard (root["code"] as? NSNumber)?.intValue == 0, let value = root["data"] as? [String: Any] else {
            let code = (root["code"] as? NSNumber)?.intValue ?? -1
            throw ProbeError(code: "BILI_API", message: "媒体接口返回错误码\(code)，可能需要登录或稍后重试")
        }
        return value
    }

    static func audioURL(_ play: [String: Any]) throws -> URL {
        if let dash = play["dash"] as? [String: Any], let audio = dash["audio"] as? [[String: Any]] {
            let candidates = audio.sorted {
                (($0["bandwidth"] as? NSNumber)?.int64Value ?? 0) > (($1["bandwidth"] as? NSNumber)?.int64Value ?? 0)
            }
            for value in candidates {
                if let raw = value["baseUrl"] as? String ?? value["base_url"] as? String,
                   let url = try? PathPolicy.networkURL(raw) { return url }
            }
        }
        // durl可能是FLV或多段视频；此原型不把第一段伪称为完整音频。
        throw ProbeError(code: "BILI_FORMAT", message: "没有可直接下载的DASH音频；分段/转码/受限资源尚待验证")
    }
}
