import ExposureNotification
import Foundation
import RealmSwift

class BTSecureStorage: SafePathsSecureStorage {

  static let shared = BTSecureStorage(inMemory: false)

  override var keychainIdentifier: String {
    "\(Bundle.main.bundleIdentifier!).realm"
  }

  private lazy var realmConfig: Realm.Configuration = {
    guard let realmConfig = getRealmConfig() else {
      fatalError("Missing realm configuration")
    }
    return realmConfig
  }()

  private let notificationCenter: NotificationCenter

  init(inMemory: Bool = false, notificationCenter: NotificationCenter = NotificationCenter.default) {
    self.notificationCenter = notificationCenter
    super.init(inMemory: inMemory)
    if !userStateExists {
      resetUserState({ _ in })
    }
  }

  override func getRealmConfig() -> Realm.Configuration? {
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
    let realm = try! Realm(configuration: realmConfig)
    return realm.object(ofType: UserState.self, forPrimaryKey: 0) ?? UserState()
  }

  var userStateExists: Bool {
    let realm = try! Realm(configuration: realmConfig)
    return realm.object(ofType: UserState.self, forPrimaryKey: 0) != nil
  }

  func setUserValue<Value: Codable>(value: Value, keyPath: String, notificationName: Notification.Name) {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      realm.create(UserState.self, value: [keyPath: value], update: .modified)
      let jsonString = value.jsonStringRepresentation()
      notificationCenter.post(name: notificationName, object: jsonString)
    }
  }

  func resetUserState(_ completion: ((UserState) -> Void)) {
    guard let realmConfig = getRealmConfig() else {
      return
    }
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      let userState = UserState()
      realm.add(userState, update: .modified)
      completion(userState)
    }
  }

  func storeExposures(_ exposures: [Exposure]) {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      userState.exposures.append(objectsIn: exposures)
      let jsonString = userState.exposures.jsonStringRepresentation()
      notificationCenter.post(name: .ExposuresDidChange, object: jsonString)
    }
  }

  func storeSymptomLogEntry(_ entry: SymptomLogEntry) {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      realm.add(entry, update: .modified)
    }
  }

  func deleteSymptomLogEntry(_ id: String) {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      if let target = realm.objects(SymptomLogEntry.self).filter("id = %@", id).first {
        realm.delete(target)
      }
    }
  }

  func deleteSymptomLogsOlderThan(_ days: Int) {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      let staleObjects = realm.objects(SymptomLogEntry.self).filter("date <= %@", Date.daysAgoInPosix(days))
      realm.delete(staleObjects)
    }
  }

  func deleteSymptomLogEntries() {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      let allObjects = realm.objects(SymptomLogEntry.self)
      realm.delete(allObjects)
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
    let realm = try! Realm(configuration: realmConfig)
    return Array(realm.objects(SymptomLogEntry.self))
  }
}
