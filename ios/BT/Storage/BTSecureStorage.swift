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
