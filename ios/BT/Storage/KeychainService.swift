import KeychainAccess

final class KeychainService {

  static let shared = KeychainService()

  private lazy var keychain = Keychain(service: "\(Bundle.main.bundleIdentifier!).keychainService")

  private var isDev: Bool {
    ReactNativeConfig.env(for: .dev) != nil
  }

  func setRevisionToken(_ token: String) {
    if isDev {
      keychain[String.revisionTokenDev] = token
    } else {
      keychain[String.revisionToken] = token
    }
  }

  var revisionToken: String {
    return (isDev ? keychain[String.revisionTokenDev] : keychain[String.revisionToken]) ?? .default
  }

}
