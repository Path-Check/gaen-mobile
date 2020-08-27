import KeychainAccess

protocol KeychainService {

  func setRevisionToken(_ token: String)
  var revisionToken: String { get }
}

@objc(DefaultKeychainService)
final class DefaultKeychainService: NSObject, KeychainService {

  @objc static let shared = DefaultKeychainService()

  private lazy var keychain = Keychain(service: ReactNativeConfig.env(for: .postKeysUrl))

  @objc func setRevisionToken(_ token: String) {
    keychain[String.revisionToken] = token
  }

  @objc var revisionToken: String {
    return keychain[String.revisionToken] ?? .default
  }

}
