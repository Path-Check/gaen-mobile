import Foundation

@objc(UtilsModule)
class UtilsModule: NSObject {
  @objc func openAppSettings() -> Void {
    let appSettingsUrl = URL(string: UIApplication.openSettingsURLString)!
    DispatchQueue.main.async {
      UIApplication.shared.open(appSettingsUrl, options: [:], completionHandler: nil)
    }
  }
}
