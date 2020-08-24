import KeychainAccess

protocol KeychainService {

  func setRevisionToken(_ token: String)
  var revisionToken: String { get }
}

@objc(DefaultKeychainService)
final class DefaultKeychainService: NSObject, KeychainService {

  @objc static let shared = DefaultKeychainService()

  private lazy var keychain = Keychain(service: ReactNativeConfig.env(for: .postKeysUrl))

  private var isDev: Bool {
    ReactNativeConfig.env(for: .dev) != nil
  }

  @objc func setRevisionToken(_ token: String) {
    if isDev {
      keychain[String.revisionTokenDev] = token
    } else {
      keychain[String.revisionToken] = token
    }
  }

  @objc var revisionToken: String {
    return (isDev ? keychain[String.revisionTokenDev] : keychain[String.revisionToken]) ?? .default
  }

}
