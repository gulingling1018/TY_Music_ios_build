import Foundation

enum PathPolicy {
    // 持久身份只存根内相对路径；每次访问重新解析当前沙盒前缀。
    static func resolve(_ relative: String, within root: URL) throws -> URL {
        guard !relative.isEmpty, !relative.hasPrefix("/"), !relative.contains("\\"),
              !relative.contains("\0"), !relative.split(separator: "/").contains("..") else {
            throw ProbeError.invalid("文件路径必须位于授权根目录内")
        }
        let base = root.standardizedFileURL.resolvingSymlinksInPath()
        let target = base.appendingPathComponent(relative).standardizedFileURL.resolvingSymlinksInPath()
        guard target.path.hasPrefix(base.path + "/") else {
            throw ProbeError.invalid("文件路径超出授权范围")
        }
        return target
    }

    static func trustedPage(_ url: URL?) -> Bool {
        guard let url else { return false }
        return url.scheme == "tymusic" && url.host == "app" && url.port == nil
            && url.user == nil && url.password == nil
    }

    static func networkURL(_ raw: String) throws -> URL {
        guard let url = URL(string: raw), url.scheme == "https", url.host != nil,
              url.user == nil, url.password == nil else {
            throw ProbeError.invalid("请输入不含账号密码的 HTTPS 地址")
        }
        return url
    }
}
