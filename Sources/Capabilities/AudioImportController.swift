import UIKit
import UniformTypeIdentifiers

@MainActor
final class AudioImportController: NSObject, UIDocumentPickerDelegate {
    weak var presenter: UIViewController?
    private let files: MediaFileStore
    private var pending: CheckedContinuation<[AudioTrack], Error>?

    init(files: MediaFileStore) { self.files = files }

    func pick() async throws -> [AudioTrack] {
        guard pending == nil, let presenter, presenter.presentedViewController == nil else {
            throw ProbeError(code: "BUSY", message: "文件选择器正在使用中")
        }
        return try await withCheckedThrowingContinuation { continuation in
            pending = continuation
            let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.audio, .mpeg4Movie], asCopy: true)
            picker.allowsMultipleSelection = true
            picker.delegate = self
            presenter.present(picker, animated: true)
        }
    }

    func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        complete(.failure(ProbeError(code: "CANCELLED", message: "已取消文件导入")))
    }

    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard (1...20).contains(urls.count) else {
            complete(.failure(ProbeError.invalid("原型每次最多导入20个文件")))
            return
        }
        let files = self.files
        // 大音频复制不能阻塞主线程；asCopy=true返回应用可访问的临时副本。
        Task {
            let result = await Task.detached(priority: .userInitiated) { () -> Result<[AudioTrack], Error> in
                var imported: [AudioTrack] = []
                do {
                    for url in urls {
                        let scoped = url.startAccessingSecurityScopedResource()
                        defer { if scoped { url.stopAccessingSecurityScopedResource() } }
                        imported.append(try files.importFile(url))
                    }
                    return .success(imported)
                } catch {
                    // 批次失败只回收本次新建副本，保留用户源文件。
                    for track in imported {
                        if let path = track.relativePath, let target = try? PathPolicy.resolve(path, within: files.root) {
                            try? FileManager.default.removeItem(at: target)
                        }
                    }
                    return .failure(error)
                }
            }.value
            complete(result)
        }
    }

    private func complete(_ result: Result<[AudioTrack], Error>) {
        let continuation = pending
        pending = nil
        continuation?.resume(with: result)
    }
}
