import Foundation

@objc(UtilsModule)
class UtilsModule: NSObject {
  @objc func openAppSettings() -> Void {
    let appSettingsUrl = URL(string: UIApplication.openSettingsURLString)!
    UIApplication.shared.open(appSettingsUrl, options: [:], completionHandler: nil)
  }
}
