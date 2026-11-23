import UIKit
import WebKit

@MainActor
final class ProbeViewController: UIViewController, WKNavigationDelegate {
    private let runtime: ProbeRuntime
    private var webView: WKWebView!
    private let failureLabel = UILabel()
    private var webGeneration = 0

    init(runtime: ProbeRuntime) { self.runtime = runtime; super.init(nibName: nil, bundle: nil) }
    required init?(coder: NSCoder) { fatalError("此控制器不使用Storyboard") }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        let root = Bundle.main.resourceURL!.appendingPathComponent("Resources/Web", isDirectory: true)
        configuration.setURLSchemeHandler(BundledSchemeHandler(root: root), forURLScheme: "tymusic")
        configuration.userContentController.addScriptMessageHandler(NativeMessageHandler(router: runtime.router), contentWorld: .page, name: "tyMusic")
        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])
        failureLabel.numberOfLines = 0
        failureLabel.textColor = .systemRed
        failureLabel.translatesAutoresizingMaskIntoConstraints = false
        failureLabel.isHidden = true
        view.addSubview(failureLabel)
        NSLayoutConstraint.activate([
            failureLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            failureLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            failureLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
        runtime.importer.presenter = self
        runtime.playback.onSnapshot = { [weak self] snapshot in self?.emit("playback", snapshot) }
        runtime.downloads.onChange = { [weak self] in
            guard let self else { return }
            do { self.emit("downloads", try self.runtime.downloads.snapshot()) }
            catch { self.emit("downloads", ["error": "无法读取下载状态"]) }
        }
        webView.load(URLRequest(url: URL(string: "tymusic://app/index.html")!))
    }

    private func emit(_ name: String, _ data: [String: Any]) {
        guard PathPolicy.trustedPage(webView.url) else { return }
        webView.callAsyncJavaScript("window.dispatchEvent(new CustomEvent('tymusic:native', {detail: {name, data}}));",
                                   arguments: ["name": name, "data": data], in: nil, in: .page) { _ in }
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        decisionHandler(navigationAction.targetFrame?.isMainFrame == true && PathPolicy.trustedPage(navigationAction.request.url) ? .allow : .cancel)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        failureLabel.isHidden = true
        emit("playback", runtime.playback.snapshot())
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        showFailure()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { showFailure() }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        // 原生播放不随网页进程重载；原型只允许一次自动恢复，避免循环闪屏。
        webGeneration += 1
        if webGeneration <= 1 { webView.reload() } else { showFailure() }
    }

    private func showFailure() {
        failureLabel.text = "验证页面加载失败，请重新打开App。原生播放状态会保留。"
        failureLabel.isHidden = false
    }
}
