import WebKit

@MainActor
final class NativeMessageHandler: NSObject, WKScriptMessageHandlerWithReply {
    private let router: ProbeRouter
    private var inFlight: Set<String> = []
    init(router: ProbeRouter) { self.router = router }

    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage,
                               replyHandler: @escaping (Any?, String?) -> Void) {
        guard message.frameInfo.isMainFrame, PathPolicy.trustedPage(message.frameInfo.request.url),
              PathPolicy.trustedPage(message.webView?.url),
              let request = try? NativeRequest(message.body), inFlight.count < 16,
              !inFlight.contains(request.id) else {
            replyHandler(nil, "拒绝非可信页面或无效桥接消息")
            return
        }
        let id = request.id
        inFlight.insert(id)
        Task {
            defer { inFlight.remove(id) }
            do {
                let data = try await router.call(operation: request.operation, body: request.body)
                replyHandler(["protocolVersion": 1, "id": id, "status": 200, "data": data], nil)
            } catch let error as ProbeError {
                replyHandler(["protocolVersion": 1, "id": id, "status": error.code == "NOT_IMPLEMENTED" ? 501 : 400,
                              "error": ["code": error.code, "message": error.message]], nil)
            } catch {
                replyHandler(["protocolVersion": 1, "id": id, "status": 500,
                              "error": ["code": "NATIVE_ERROR", "message": "原生操作失败，请检查文件、网络或设备状态"]], nil)
            }
        }
    }
}
