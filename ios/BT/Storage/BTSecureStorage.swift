import ExposureNotification
import Foundation
import RealmSwift

class BTSecureStorage {

  static let shared = BTSecureStorage(inMemory: false)

  var keychainIdentifier: String {
    "\(Bundle.main.bundleIdentifier!).realm"
  }

  let identifier: String
  let inMemory: Bool

  private lazy var realmConfig: Realm.Configuration = {
    guard let realmConfig = getRealmConfig() else {
      fatalError("Missing realm configuration")
    }
    return realmConfig
  }()

  private func realm() -> Realm {
    do {
      let realm = try Realm(configuration: realmConfig)
      return realm
    } catch {
      resetRealm()
      let realm = try! Realm(configuration: realmConfig)
      return realm
    }
  }

  private func resetRealm() {
    guard let url = getRealmConfig()?.fileURL else { return }
    do {
      try FileManager.default.removeItem(at: url)
    } catch {
      assertionFailure("Failed to delete realm instance from file system")
    }
  }

  private let notificationCenter: NotificationCenter

  private lazy var keychainTag = keychainIdentifier.data(using: String.Encoding.utf8, allowLossyConversion: false)!
  private lazy var keychainAccessControl = SecAccessControlCreateWithFlags(nil, kSecAttrAccessibleAfterFirstUnlock, [], nil)!

  init(inMemory: Bool = false, notificationCenter: NotificationCenter = NotificationCenter.default) {
    self.notificationCenter = notificationCenter
    self.identifier = UUID().uuidString
    self.inMemory = inMemory
    if !userStateExists {
      resetUserState({ _ in })
    }
  }

  private lazy var keychainQuery: [CFString: Any] = [
    kSecClass: kSecClassKey,
    kSecAttrApplicationTag: keychainTag,
    kSecAttrKeySizeInBits: 512,
    kSecReturnData: true,
    kSecMatchLimit: kSecMatchLimitOne,
  ]

  private lazy var keychainUpdateQuery: [CFString: Any] = [
    kSecClass: kSecClassKey,
    kSecAttrApplicationTag: keychainTag,
    kSecAttrKeySizeInBits: 512,
  ]

  final func getEncryptionKey() -> NSData? {
    // First check in the keychain for an existing key
    // To avoid Swift optimization bug, should use withUnsafeMutablePointer() function to retrieve the keychain item
    // See also: http://stackoverflow.com/questions/24145838/querying-ios-keychain-using-swift/27721328#27721328
    var keychainData: CFTypeRef?
    var status = withUnsafeMutablePointer(to: &keychainData) {
      SecItemCopyMatching(keychainQuery as CFDictionary, UnsafeMutablePointer($0))
    }

    if status == errSecSuccess, let keychainData = keychainData as? NSData {
      // For backwards compatibility, ensure existing items have the correct access control
      status = SecItemUpdate(keychainUpdateQuery as CFDictionary, [
        kSecAttrAccessControl: keychainAccessControl,
      ] as CFDictionary)
      assert(status == errSecSuccess, "Failed to set access control")

      return keychainData
    }

    // No pre-existing key from this application, so generate a new one
    let keyData = NSMutableData(length: 64)!
    status = SecRandomCopyBytes(kSecRandomDefault, 64, keyData.mutableBytes.bindMemory(to: UInt8.self, capacity: 64))

    guard status == errSecSuccess else {
      assertionFailure("Failed to get random bytes")
      return nil
    }

    // Store the key in the keychain
    let query: [CFString: Any] = [
      kSecClass: kSecClassKey,
      kSecAttrApplicationTag: keychainTag,
      kSecAttrAccessControl: keychainAccessControl,
      kSecAttrKeySizeInBits: 512 as AnyObject,
      kSecValueData: keyData,
    ]

    status = SecItemAdd(query as CFDictionary, nil)

    guard status == errSecSuccess else {
      assertionFailure("Failed to insert the new key in the keychain")
      return nil
    }

    return keyData
  }

  func getRealmConfig() -> Realm.Configuration? {
    if let key = getEncryptionKey() {
      if (inMemory) {
        return Realm.Configuration(inMemoryIdentifier: identifier, encryptionKey: key as Data, schemaVersion: 11,
                                   migrationBlock: { _, _ in }, objectTypes: [UserState.self,
                                                                              Exposure.self,
                                                                              SymptomLogEntry.self])
      } else {
        return Realm.Configuration(encryptionKey: key as Data, schemaVersion: 11,
                                   migrationBlock: { _, _ in }, objectTypes: [UserState.self,
                                                                              Exposure.self,
                                                                              SymptomLogEntry.self])
      }
    } else {
      return nil
    }
  }

  var userState: UserState {
    let realmInstance = realm()
    return realmInstance.object(ofType: UserState.self, forPrimaryKey: 0) ?? UserState()
  }

  var userStateExists: Bool {
    let realmInstance = realm()
    return realmInstance.object(ofType: UserState.self, forPrimaryKey: 0) != nil
  }

  func setUserValue<Value: Codable>(value: Value, keyPath: String, notificationName: Notification.Name) {
    let realmInstance = realm()
    try! realmInstance.write {
      realmInstance.create(UserState.self, value: [keyPath: value], update: .modified)
      let jsonString = value.jsonStringRepresentation()
      notificationCenter.post(name: notificationName, object: jsonString)
    }
  }

  func resetUserState(_ completion: ((UserState) -> Void)) {
    let realmInstance = realm()
    try! realmInstance.write {
      let userState = UserState()
      realmInstance.add(userState, update: .modified)
      completion(userState)
    }
  }

  func storeExposures(_ exposures: [Exposure]) {
    let realmInstance = realm()
    try! realmInstance.write {
      userState.exposures.append(objectsIn: exposures)
      let jsonString = userState.exposures.jsonStringRepresentation()
      notificationCenter.post(name: .ExposuresDidChange, object: jsonString)
    }
  }

  func storeSymptomLogEntry(_ entry: SymptomLogEntry) {
    let realmInstance = realm()
    try! realmInstance.write {
      realmInstance.add(entry, update: .modified)
    }
  }

  func deleteSymptomLogEntry(_ id: String) {
    let realmInstance = realm()
    try! realmInstance.write {
      if let target = realmInstance.objects(SymptomLogEntry.self).filter("id = %@", id).first {
        realmInstance.delete(target)
      }
    }
  }

  func deleteSymptomLogsOlderThan(_ days: Int) {
    let realmInstance = realm()
    try! realmInstance.write {
      let staleObjects = realmInstance.objects(SymptomLogEntry.self).filter("date <= %@", Date.daysAgoInPosix(days))
      realmInstance.delete(staleObjects)
    }
  }

  func deleteSymptomLogEntries() {
    let realmInstance = realm()
    try! realmInstance.write {
      let allObjects = realmInstance.objects(SymptomLogEntry.self)
      realmInstance.delete(allObjects)
    }
  }

  func canStoreExposure(for date: Date) -> Bool {
    return !userState.exposures.map { $0.date }.contains(date.posixRepresentation)
  }

  @Persisted(keyPath: .remainingDailyFileProcessingCapacity, notificationName: .remainingDailyFileProcessingCapacityDidChange, defaultValue: Constants.dailyFileProcessingCapacity)
  var remainingDailyFileProcessingCapacity: Int

  @Persisted(keyPath: .urlOfMostRecentlyDetectedKeyFile, notificationName: .UrlOfMostRecentlyDetectedKeyFileDidChange, defaultValue: .default)
  var urlOfMostRecentlyDetectedKeyFile: String

  @Persisted(keyPath: .keyPathExposures, notificationName: .ExposuresDidChange, defaultValue: List<Exposure>())
  var exposures: List<Exposure>

  @Persisted(keyPath: .keyPathdateLastPerformedFileCapacityReset,
             notificationName: .dateLastPerformedFileCapacityResetDidChange, defaultValue: nil)
  var dateLastPerformedFileCapacityReset: Date?

  @Persisted(keyPath: .keyPathLastExposureCheckDate,
             notificationName: .lastExposureCheckDateDidChange, defaultValue: nil)
  var lastExposureCheckDate: Date?

  @Persisted(keyPath: .keyPathHMACKey,
             notificationName: .HMACKeyDidChange, defaultValue: "")
  var HMACKey: String

  @Persisted(keyPath: .revisionToken,
             notificationName: .revisionTokenDidChange, defaultValue: "")
  var revisionToken: String

  @Persisted(keyPath: .keyPathExposureDetectionErrorLocalizedDescription, notificationName:
              .StorageExposureDetectionErrorLocalizedDescriptionDidChange, defaultValue: .default)
  var exposureDetectionErrorLocalizedDescription: String

  var symptomLogEntries: [SymptomLogEntry] {
    let realmInstance = realm()
    return Array(realmInstance.objects(SymptomLogEntry.self))
  }
}
