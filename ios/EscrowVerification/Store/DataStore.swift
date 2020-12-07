import Foundation

class DataStore {
  static let shared = DataStore()
  
  @EscrowVerificationPersisted(userDefaultsKey: "authToken", notificationName: .init("StoredAuthTokenDidChange"), defaultValue: nil)
  var authToken: String?
  
  @EscrowVerificationPersisted(userDefaultsKey: "refreshToken", notificationName: .init("StoredRefreshTokenDidChange"), defaultValue: nil)
  var refreshToken: String?
  
  @EscrowVerificationPersisted(userDefaultsKey: "tokenExpiration", notificationName: .init("StoredTokenExpirationDidChange"), defaultValue: nil)
  var tokenExpiration: Date?
  
}

@propertyWrapper
class EscrowVerificationPersisted<Value: Codable> {
  
  init(userDefaultsKey: String, notificationName: Notification.Name, defaultValue: Value) {
    self.userDefaultsKey = userDefaultsKey
    self.notificationName = notificationName
    if let data = UserDefaults.standard.data(forKey: userDefaultsKey) {
      do {
        wrappedValue = try JSONDecoder().decode(Value.self, from: data)
      } catch {
        wrappedValue = defaultValue
      }
    } else {
      wrappedValue = defaultValue
    }
  }
  
  let userDefaultsKey: String
  let notificationName: Notification.Name
  
  var wrappedValue: Value {
    didSet {
      UserDefaults.standard.set(try! JSONEncoder().encode(wrappedValue), forKey: userDefaultsKey)
      NotificationCenter.default.post(name: notificationName, object: nil)
    }
  }
  
  var projectedValue: EscrowVerificationPersisted<Value> { self }
  
  func addObserver(using block: @escaping () -> Void) -> NSObjectProtocol {
    return NotificationCenter.default.addObserver(forName: notificationName, object: nil, queue: nil) { _ in
      block()
    }
  }
}


