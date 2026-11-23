import UIKit

@main
@MainActor
final class AppDelegate: UIResponder, UIApplicationDelegate {
    private(set) var runtime: ProbeRuntime?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        do {
            runtime = try ProbeRuntime()
        } catch { runtime = nil }
        return true
    }

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let configuration = UISceneConfiguration(name: "Default", sessionRole: connectingSceneSession.role)
        configuration.delegateClass = SceneDelegate.self
        return configuration
    }

    func applicationWillTerminate(_ application: UIApplication) { runtime?.playback.checkpoint() }

    func application(_ application: UIApplication, handleEventsForBackgroundURLSession identifier: String,
                     completionHandler: @escaping () -> Void) {
        guard identifier == ProbeDownloadService.sessionIdentifier, let runtime else { completionHandler(); return }
        runtime.downloads.backgroundCompletion = completionHandler
    }
}
