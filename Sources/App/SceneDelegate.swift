import UIKit

@MainActor
final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let scene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: scene)
        if let runtime = (UIApplication.shared.delegate as? AppDelegate)?.runtime {
            window.rootViewController = ProbeViewController(runtime: runtime)
        } else {
            let failure = UIViewController()
            failure.view.backgroundColor = .systemBackground
            let label = UILabel()
            label.text = "无法初始化本地存储，请检查设备可用空间后重新打开。"
            label.numberOfLines = 0
            label.translatesAutoresizingMaskIntoConstraints = false
            failure.view.addSubview(label)
            NSLayoutConstraint.activate([
                label.leadingAnchor.constraint(equalTo: failure.view.safeAreaLayoutGuide.leadingAnchor, constant: 24),
                label.trailingAnchor.constraint(equalTo: failure.view.safeAreaLayoutGuide.trailingAnchor, constant: -24),
                label.centerYAnchor.constraint(equalTo: failure.view.centerYAnchor)
            ])
            window.rootViewController = failure
        }
        self.window = window
        window.makeKeyAndVisible()
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        (UIApplication.shared.delegate as? AppDelegate)?.runtime?.playback.checkpoint()
    }
}
