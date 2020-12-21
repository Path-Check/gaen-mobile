import Foundation

@objc(UtilsModule)
class UtilsModule: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func openAppSettings() -> Void {
    let appSettingsUrl = URL(string: UIApplication.openSettingsURLString)!
    DispatchQueue.main.async {
      UIApplication.shared.open(appSettingsUrl, options: [:], completionHandler: nil)
    }
  }
}
