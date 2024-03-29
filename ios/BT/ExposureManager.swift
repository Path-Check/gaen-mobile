import Foundation
import ExposureNotification
import RealmSwift
import UserNotifications
import BackgroundTasks
import Promises

enum ExposureManagerErrorCode: String {
  case cannotEnableNotifications = "cannot_enable_notifications"
  case networkFailure = "network_request_error"
  case noExposureKeysFound = "no_exposure_keys_found"
  case detectionNeverPerformed = "no_last_detection_date"
}

@objc(ExposureManagerError)
final class ExposureManagerError: NSObject, LocalizedError {

  @objc let errorCode: String
  @objc let localizedMessage: String
  @objc let underlyingError: Error

  init(errorCode: ExposureManagerErrorCode,
       localizedMessage: String,
       underlyingError: Error = GenericError.unknown) {
    self.errorCode = errorCode.rawValue
    self.localizedMessage = localizedMessage
    self.underlyingError = underlyingError
  }

  var errorDescription: String? {
    return localizedMessage
  }
}

enum ENAPIVersion { case V1, V2 }

@objc(ExposureManager)
/**
 This class wraps [ENManager](https://developer.apple.com/documentation/exposurenotification/enmanager) and acts like a controller and entry point of the different flows
 */

final class ExposureManager: NSObject {

  private static let chaffBackgroundTaskIdentifier = "\(Bundle.main.bundleIdentifier!).chaff"
  private static let exposureDetectionBackgroundTaskIdentifier = "\(Bundle.main.bundleIdentifier!).exposure-notification"
  private static let deleteOldExposuresBackgroundTaskIdentifier = "\(Bundle.main.bundleIdentifier!).delete-old-exposures"
  private static let enxMigrationBackgroundTaskIdentifier = "\(Bundle.main.bundleIdentifier!).enx-migration"

  @objc private(set) static var shared: ExposureManager?

  // MARK: == Lifecycle ==

  @objc static func createSharedInstance() {
    shared = ExposureManager()
  }
  /**
   !  @defgroup  Lifecycle

   Since the underlying  is required
   to be initialezed before it can be used, we call [activate](https://developer.apple.com/documentation/exposurenotification/enmanager/3583720-activate)
   when initializing this wrapper. Also, when the ENManager instance is no longer required, it should be invalidated,
   that is done in the deinit.
  */

  public let manager: ExposureNotificationManager
  public let apiClient: APIClient
  public let btSecureStorage: BTSecureStorage
  public let bgTaskScheduler: BackgroundTaskScheduler
  public let notificationCenter: NotificationCenter
  public let userNotificationCenter: UserNotificationCenter

  init(exposureNotificationManager: ExposureNotificationManager = ENManager(),
       apiClient: APIClient = BTAPIClient.shared,
       btSecureStorage: BTSecureStorage = BTSecureStorage.shared,
       backgroundTaskScheduler: BackgroundTaskScheduler = BGTaskScheduler.shared,
       notificationCenter: NotificationCenter = NotificationCenter.default,
       userNotificationCenter: UserNotificationCenter = UNUserNotificationCenter.current()) {
    self.manager = exposureNotificationManager
    self.apiClient = apiClient
    self.btSecureStorage = btSecureStorage
    self.bgTaskScheduler = backgroundTaskScheduler
    self.notificationCenter = notificationCenter
    self.userNotificationCenter = userNotificationCenter
    super.init()
    self.manager.activate { [weak self] error in
      if error == nil {
        self?.activateSuccess()
      }
    }
    // Schedule background tasks if needed whenever EN authorization status changes
    notificationCenter.addObserver(
      self,
      selector: #selector(scheduleExposureDetectionBackgroundTaskIfNeeded),
      name: .ExposureNotificationStatusDidChange,
      object: nil
    )

    notificationCenter.addObserver(
      self,
      selector: #selector(scheduleChaffBackgroundTaskIfNeeded),
      name: .ChaffRequestTriggered,
      object: nil
    )

    notificationCenter.addObserver(
      self,
      selector: #selector(scheduleEnxBackgroundTaskIfNeeded),
      name: .EnxNotificationTriggered,
      object: nil
    )
  }

  deinit {
    manager.invalidate()
  }

  /// Broadcast EN Status
  @objc func awake() {
    broadcastCurrentExposureNotificationStatus()
  }

  // MARK: == State ==

  enum ExposureNoticationStatus: String {
    case unknown = "Unknown"
    case active = "Active"
    case disabled = "Disabled"
    case bluetoothOff = "BluetoothOff"
    case restricted = "Restricted"
    case paused = "Paused"
    case unauthorized = "Unauthorized"
  }

  var exposureNotificationStatus: ExposureNoticationStatus {
    switch manager.exposureNotificationStatus {
    case .unknown:
      return .unknown
    case .active:
      return .active
    case .disabled:
      return .disabled
    case .bluetoothOff:
      return .bluetoothOff
    case .restricted:
      return .restricted
    case .paused:
      return .paused
    case .unauthorized:
      return .unauthorized
    default:
      return .unknown
    }
  }

  ///Returns both the current authorizationState and enabledState as Strings
  @objc func getCurrentENPermissionsStatus(callback: @escaping (String) -> Void) {
    callback(exposureNotificationStatus.rawValue)
  }

  /// Returns the current exposures as a json string representation
  @objc var currentExposures: String {
    return btSecureStorage.userState.recentExposures.jsonStringRepresentation()
  }

  /// Update last exposure check date
  func updateLastExposureCheckDate() {
    btSecureStorage.lastExposureCheckDate = Date()
  }

  /// Returns the symptom log entries as array of dictionaries
  @objc var symptomLogEntries: [[String: Any]] {
    return btSecureStorage.symptomLogEntries.map { $0.asDictionary }
  }

  @objc func deleteSymptomLogsOlderThan(_ days: Int) {
    btSecureStorage.deleteSymptomLogsOlderThan(days)
  }

  /// Persists SymptomLogEntry in Realm
  @objc func saveSymptomLogEntry(_ entry: SymptomLogEntry) {
    return btSecureStorage.storeSymptomLogEntry(entry)
  }

  /// Deletes SymptomLogEntry in Realm
  @objc func deleteSymptomLogEntry(_ id: String) {
    return btSecureStorage.deleteSymptomLogEntry(id)
  }

  /// Deletes All SymptomLogEntries from Realm
  @objc func deleteSymptomLogEntries() {
    return btSecureStorage.deleteSymptomLogEntries()
  }

  //Notifies the user they need to migrate
  func notifyUserEnxIfNeeded() {
    let defaults = UserDefaults.standard
    let lastEnxTimestamp = defaults.double(forKey: "lastEnxTimestamp") // defaults to 0 if it does not exist https://developer.apple.com/documentation/foundation/userdefaults/1416581-double
    var enxCount = defaults.double(forKey: "enxCount") // defaults to 0 if it does not exist https://developer.apple.com/documentation/foundation/userdefaults/1416581-double
    let newDate = Date.init();
    
    var sameDay = false; // default to false in case lastEnxTimestamp has not been created yet
    
    if (lastEnxTimestamp != 0) {
      sameDay = Calendar.current.isDate(newDate, inSameDayAs: Date(timeIntervalSince1970: lastEnxTimestamp))
    }

    if (enxCount < 3 && sameDay == false) {
      enxCount += 1
      defaults.set(enxCount, forKey: "enxCount");
      defaults.set(newDate.timeIntervalSince1970, forKey: "lastEnxTimestamp");

      let identifier = String.enxMigrationIdentifier
      let content = UNMutableNotificationContent()
      content.title = String.enxMigrationNotificationTitle.localized
      content.body = String(ReactNativeConfig.env(for: .enxNotificationText))
      //content.body = String.enxMigrationNotificationContent.localized
      content.userInfo = [String.notificationUrlKey: "\(String.notificationUrlBasePath)"]
      content.sound = .default

      let request = UNNotificationRequest(identifier: identifier, content: content, trigger: nil)
      userNotificationCenter.add(request) { error in
        DispatchQueue.main.async {
          if let error = error {
            print("Error showing error user notification: \(error)")
          }
        }
      }
    }
  }

  ///Notifies the user to enable bluetooth to be able to exchange keys
  func notifyUserBlueToothOffIfNeeded() {
    let identifier = String.bluetoothNotificationIdentifier
    // Bluetooth must be enabled in order for the device to exchange keys with other devices
    if manager.exposureNotificationStatus == .bluetoothOff {
      let content = UNMutableNotificationContent()
      content.title = String.bluetoothNotificationTitle.localized
      content.body = String.bluetoothNotificationBody.localized
      content.sound = .default
      let request = UNNotificationRequest(identifier: identifier, content: content, trigger: nil)
      userNotificationCenter.add(request) { error in
        DispatchQueue.main.async {
          if let error = error {
            print("Error showing error user notification: \(error)")
          }
        }
      }
    } else {
      userNotificationCenter.removeDeliveredNotifications(withIdentifiers: [identifier])
    }
  }

  // MARK: == Diagnosis Keys ==

  typealias ExposureKeysDictionaryArray = [[String: Any]]

  /// Requests the temporary exposure keys used by this device to share with a server. Returns an array of the exposures keys as dictionary or an error if the underlying API fails
  @objc func fetchExposureKeys(callback: @escaping (ExposureKeysDictionaryArray?, ExposureManagerError?) -> Void) {
    getDiagnosisKeys(transform: { (keys) -> ExposureKeysDictionaryArray in
      (keys ?? []).map { $0.asDictionary }
    }, callback: callback)
  }

  @objc func fetchChaffKeys(callback: @escaping (ExposureKeysDictionaryArray?, ExposureManagerError?) -> Void) {
    getDiagnosisKeys(transform: { (keys) -> ExposureKeysDictionaryArray in
      (keys ?? []).map { $0.asDictionary }
    }, callback: callback)
  }

  @objc func registerEnxMigrationBackgroundTask() {
    bgTaskScheduler.register(forTaskWithIdentifier: ExposureManager.enxMigrationBackgroundTaskIdentifier,
                             using: .main) { [weak self] task in
      //let state = UIApplication.shared.applicationState
      //if state == .background || state == .inactive {
      // background
      self?.scheduleEnxBackgroundTaskIfNeeded()
      //} 
    }
  }


  // MARK: == Exposure Detection ==

  /**
   Registers the background task of detecting exposures
    All launch handlers must be registered before application finishes launching
   */
  @objc func registerExposureDetectionBackgroundTask() {
    bgTaskScheduler.register(forTaskWithIdentifier: ExposureManager.exposureDetectionBackgroundTaskIdentifier,
                             using: .main) { [weak self] task in
      guard let strongSelf = self else { return }
      // Notify the user if bluetooth is off
      strongSelf.notifyUserBlueToothOffIfNeeded()

      strongSelf.notifyUserEnxIfNeeded()

      // Perform the exposure detection
      let progress = strongSelf.detectExposures { result in
        switch result {
        case .success:
          task.setTaskCompleted(success: true)
        case .failure:
          task.setTaskCompleted(success: false)
        }
      }

      // Handle running out of time
      task.expirationHandler = {
        progress.cancel()
        BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = NSLocalizedString("BACKGROUND_TIMEOUT", comment: "Error")
      }

      // Schedule the next background task
      self?.scheduleExposureDetectionBackgroundTaskIfNeeded()
    }
  }

  /**
   Registers the background task of sending chaff requests
   All launch handlers must be registered before application finishes launching
   */
  @objc func registerChaffBackgroundTask() {
    bgTaskScheduler.register(forTaskWithIdentifier: ExposureManager.chaffBackgroundTaskIdentifier,
                             using: .main) { [weak self] task in

      let currentHour = Calendar.current.dateComponents([.hour], from: Date()).hour ?? 0

      if (currentHour > 8 && currentHour < 19) {

      // We want to throttle chaff to at the most, every 24 hours then perform a randomness flip.
      // Perform the chaff request, the following code works as follows:
      // Get a random value, if the value is between 8 and 19 and it has been 24 hours since the
      // last successful request, perform a new request.
        let defaults = UserDefaults.standard
        let randomNum = Int.random(in: 0..<20)
        let lastChaffTimestamp = defaults.double(forKey: "lastChaffTimestamp")
        
        if ((lastChaffTimestamp == 0 || ((self?.hasBeenTwentyFourHours(lastSubmitted: lastChaffTimestamp)) != nil)) && (randomNum > 8 && randomNum < 19 )) {
          self?.performChaffRequest()
        }
      }

      // Schedule the next background task
      self?.scheduleChaffBackgroundTaskIfNeeded()
                             }
  }
  /**
   Registers the background task of deleting exposures > 14 days old
   from the local database
   */
  @objc func registerDeleteOldExposuresBackgroundTask() {
    bgTaskScheduler.register(forTaskWithIdentifier: ExposureManager.deleteOldExposuresBackgroundTaskIdentifier,
                             using: .main) { [weak self] task in

      self?.btSecureStorage.deleteExposuresOlderThan(14)

      // Schedule the next background task
      self?.scheduleDeleteOldExposuresBackgroundTaskIfNeeded()
    }
  }
  
  /**
      Checks to see if it has been twenty four hours since the last chaff submission.
   */
  func hasBeenTwentyFourHours(lastSubmitted: Double) -> Bool {
    let timeComparison = Date.init(timeIntervalSinceNow: lastSubmitted)
    let twentyFourHoursAgo = Date.init(timeIntervalSinceNow: -3600 * 24)
    return timeComparison >= twentyFourHoursAgo
  }

  @objc func scheduleEnxBackgroundTaskIfNeeded() {
    guard manager.exposureNotificationStatus == .active else { return }
    let taskRequest = BGProcessingTaskRequest(identifier: ExposureManager.enxMigrationBackgroundTaskIdentifier)
    taskRequest.requiresNetworkConnectivity = false
    do {
      try bgTaskScheduler.submit(taskRequest)
    } catch {
      print("Unable to schedule background task: \(error)")
    }
  }

  @objc func scheduleExposureDetectionBackgroundTaskIfNeeded() {
    guard manager.exposureNotificationStatus == .active else { return }
    let taskRequest = BGProcessingTaskRequest(identifier: ExposureManager.exposureDetectionBackgroundTaskIdentifier)
    taskRequest.requiresNetworkConnectivity = true
    do {
      try bgTaskScheduler.submit(taskRequest)
    } catch {
      print("Unable to schedule background task: \(error)")
    }
  }

  @objc func scheduleChaffBackgroundTaskIfNeeded() {
    guard manager.exposureNotificationStatus == .active else { return }
    let taskRequest = BGProcessingTaskRequest(identifier: ExposureManager.chaffBackgroundTaskIdentifier)
    taskRequest.requiresNetworkConnectivity = true
    do {
      try bgTaskScheduler.submit(taskRequest)
    } catch {
      print("Unable to schedule background task: \(error)")
    }
  }
  
  func scheduleDeleteOldExposuresBackgroundTaskIfNeeded() {
    let taskRequest = BGProcessingTaskRequest(identifier: ExposureManager.deleteOldExposuresBackgroundTaskIdentifier)
    taskRequest.requiresNetworkConnectivity = false
    do {
      try bgTaskScheduler.submit(taskRequest)
    } catch {
      print("Unable to schedule background task: \(error)")
    }
  }

  private var isDetectingExposures = false

  @objc func detectExposures(resolve: @escaping RCTPromiseResolveBlock,
                             reject: @escaping RCTPromiseRejectBlock) {
    detectExposures { result in
      switch result {
      case .success:
        resolve(String.genericSuccess)
      case .failure(let error):
        let errorString = error._code.enErrorString
        reject(errorString, error.localizedDescription, error)
      }
    }
  }

  /// Requests enabling Exposure Notifications to the underlying manager, if success, it broadcasts the new status
  @objc func requestExposureNotificationAuthorization(resolve: @escaping RCTPromiseResolveBlock,
                             reject: @escaping RCTPromiseRejectBlock) {
    // Ensure exposure notifications are enabled if the app is authorized. The app
    // could get into a state where it is authorized, but exposure
    // notifications are not enabled,  if the user initially denied Exposure Notifications
    // during onboarding, but then flipped on the "COVID-19 Exposure Notifications" switch
    // in Settings.
    manager.setExposureNotificationEnabled(true) { error in
      if let error = error {
        let errorString = error._code.enErrorString
        reject(errorString, error.localizedDescription, error)
      } else if (self.exposureNotificationStatus != .active) {
        let error = GenericError.unknown
        var errorString = 0.enErrorString
        switch self.exposureNotificationStatus {
        case .bluetoothOff:
          errorString = 7.enErrorString
        case .disabled:
          errorString = 9.enErrorString
        case .restricted:
          errorString = 14.enErrorString
        case .unauthorized:
          errorString = 4.enErrorString
        default:
          errorString = 1.enErrorString
        }
        reject(errorString, error.localizedDescription, error)
      } else {
        self.broadcastCurrentExposureNotificationStatus()
        resolve(self.exposureNotificationStatus.rawValue)
      }
    }
  }

  @discardableResult func detectExposures(completionHandler: @escaping ((ExposureResult) -> Void)) -> Progress {
    if #available(iOS 13.7, *) {
      return detectExposuresV2(completionHandler: completionHandler)
    } else {
      return detectExposuresV1(completionHandler: completionHandler)
    }
  }

  @discardableResult func detectExposuresV1(completionHandler: @escaping ((ExposureResult) -> Void)) -> Progress {

    let progress = Progress()
    var lastProcessedUrlPath: String = .default
    var processedFileCount: Int = 0
    var unpackedArchiveURLs: [URL] = []

    Promise<[Exposure]>(on: .global()) { () -> [Exposure] in
      if self.isDetectingExposures {
        // Disallow concurrent exposure detection,
        // because if allowed we might try to detect the same diagnosis keys more than once
        throw ExposureError.default("Detection Already in Progress")
      }
      self.isDetectingExposures = true
      // Reset file capacity to 15 if > 24 hours have elapsed since last reset
      self.updateRemainingFileCapacity()
      guard self.btSecureStorage.userState.remainingDailyFileProcessingCapacity > 0 else {
        // Update last exposure check date for representation in the UI
        self.updateLastExposureCheckDate()

        // Abort because daily file capacity is exceeded
        return []
      }
      let indexFileString = try awaitPromise(self.fetchIndexFile())
      let remoteURLs = indexFileString.gaenFilePaths
      let targetUrls = self.urlPathsToProcess(remoteURLs, apiVersion: .V1)
      lastProcessedUrlPath = targetUrls.last ?? .default
      processedFileCount = targetUrls.count
      let downloadedKeyArchives = try awaitPromise(self.downloadKeyArchives(targetUrls: targetUrls))
      unpackedArchiveURLs = try awaitPromise(self.unpackKeyArchives(packages: downloadedKeyArchives))
      let exposureConfiguration = try awaitPromise(self.getExposureConfigurationV1())
      let exposureSummary = try awaitPromise(self.callDetectExposures(configuration: exposureConfiguration.asENExposureConfiguration,
                                                               diagnosisKeyURLs: unpackedArchiveURLs))
      var newExposures: [Exposure] = []
      if let summary = exposureSummary, summary.isAboveScoreThreshold(with: exposureConfiguration) {
        newExposures = try awaitPromise(self.getExposureInfoAndNotifyUser(summary: summary))
      }
      return newExposures
    }.then { result in
      self.finish(.success(result),
                  processedFileCount: processedFileCount,
                  lastProcessedUrlPath: lastProcessedUrlPath,
                  progress: progress,
                  apiVersion: .V1,
                  completionHandler: completionHandler)
    }.catch { error in
      self.finish(.failure(error),
                  processedFileCount: processedFileCount,
                  lastProcessedUrlPath: lastProcessedUrlPath,
                  progress: progress,
                  apiVersion: .V1,
                  completionHandler: completionHandler)
    }.always {
      unpackedArchiveURLs.cleanup()
      self.isDetectingExposures = false
    }
    return progress
  }

  @available(iOS 13.7, *)
  @discardableResult func detectExposuresV2(completionHandler: @escaping ((ExposureResult) -> Void)) -> Progress {

    let progress = Progress()
    var lastProcessedUrlPath: String = .default
    var processedFileCount: Int = 0
    var unpackedArchiveURLs: [URL] = []

    Promise<[Exposure]>(on: .global()) { () -> [Exposure] in
      if self.isDetectingExposures {
        // Disallow concurrent exposure detection,
        // because if allowed we might try to detect the same diagnosis keys more than once
        throw ExposureError.default("Detection Already in Progress")
      }
      self.isDetectingExposures = true
      let indexFileString = try awaitPromise(self.fetchIndexFile())
      let remoteURLs = indexFileString.gaenFilePaths
      let targetUrls = self.urlPathsToProcess(remoteURLs, apiVersion: .V2)
      lastProcessedUrlPath = targetUrls.last ?? .default
      processedFileCount = targetUrls.count
      let downloadedKeyArchives = try awaitPromise(self.downloadKeyArchives(targetUrls: targetUrls))
      unpackedArchiveURLs = try awaitPromise(self.unpackKeyArchives(packages: downloadedKeyArchives))
      let exposureConfiguraton = try awaitPromise(self.getExposureConfigurationV2())
      let exposureSummary = try awaitPromise(self.callDetectExposures(configuration: exposureConfiguraton.asENExposureConfiguration,
                                                               diagnosisKeyURLs: unpackedArchiveURLs))
      var newExposures: [Exposure] = []
      if let summary = exposureSummary {
        summary.daySummaries.forEach { (daySummary) in
          if daySummary.isAboveScoreThreshold(with: exposureConfiguraton) &&
              self.btSecureStorage.canStoreExposure(for: daySummary.date) {
            let exposure = Exposure(id: UUID().uuidString,
                                    date: daySummary.date.posixRepresentation,
                                    weightedDurationSum: daySummary.daySummary.weightedDurationSum)
            newExposures.append(exposure)
          }
        }
      }
      if newExposures.count > 0 {
        self.notifyUserExposureDetected()
      }
      return newExposures
    }.then { result in
      self.finish(.success(result),
                  processedFileCount: processedFileCount,
                  lastProcessedUrlPath: lastProcessedUrlPath,
                  progress: progress,
                  apiVersion: .V2,
                  completionHandler: completionHandler)
    }.catch { error in
      self.finish(.failure(error),
                  processedFileCount: processedFileCount,
                  lastProcessedUrlPath: lastProcessedUrlPath,
                  progress: progress,
                  apiVersion: .V2,
                  completionHandler: completionHandler)
    }.always {
      unpackedArchiveURLs.cleanup()
      self.isDetectingExposures = false
    }
    return progress
  }

  func finish(_ result: GenericResult<[Exposure]>,
              processedFileCount: Int,
              lastProcessedUrlPath: String,
              progress: Progress,
              apiVersion: ENAPIVersion,
              completionHandler: ((ExposureResult) -> Void)) {

    // Update last exposure check date for representation in the UI
    updateLastExposureCheckDate()

    if progress.isCancelled {
      btSecureStorage.exposureDetectionErrorLocalizedDescription = GenericError.unknown.localizedDescription
      completionHandler(.failure(ExposureError.cancelled))
    } else {
      switch result {
      case let .success(newExposures):
        btSecureStorage.exposureDetectionErrorLocalizedDescription = .default
        if apiVersion == .V1 {
          btSecureStorage.remainingDailyFileProcessingCapacity -= processedFileCount
        }
        if lastProcessedUrlPath != .default {
          btSecureStorage.urlOfMostRecentlyDetectedKeyFile = lastProcessedUrlPath
        }
        btSecureStorage.storeExposures(newExposures)
        completionHandler(.success(processedFileCount))
      case let .failure(error):
        btSecureStorage.exposureDetectionErrorLocalizedDescription = error.localizedDescription
        completionHandler(.failure(error))
      }
    }
  }

  func postExposureDetectionErrorNotification(_ errorString: String?) {
    #if DEBUG
    let identifier = String.exposureDetectionErrorNotificationIdentifier

    let content = UNMutableNotificationContent()
    content.title = String.exposureDetectionErrorNotificationTitle.localized
    content.body = errorString ?? String.exposureDetectionErrorNotificationBody.localized
    content.sound = .default
    let request = UNNotificationRequest(identifier: identifier, content: content, trigger: nil)
    userNotificationCenter.add(request) { error in
      DispatchQueue.main.async {
        if let error = error {
          print("Error showing error user notification: \(error)")
        }
      }
    }
    #endif
  }
}

// MARK: - FileProcessing

extension ExposureManager {

  func startIndex(for urlPaths: [String]) -> Int {
    let path = btSecureStorage.userState.urlOfMostRecentlyDetectedKeyFile
    if let lastIdx = urlPaths.firstIndex(of: path) {
      return min(lastIdx + 1, urlPaths.count)
    }
    return 0
  }

  func urlPathsToProcess(_ urlPaths: [String], apiVersion: ENAPIVersion) -> [String] {
    let startIdx = startIndex(for: urlPaths)
    let endIdx = apiVersion == .V2 ? urlPaths.count : min(startIdx + btSecureStorage.userState.remainingDailyFileProcessingCapacity, urlPaths.count)
    return Array(urlPaths[startIdx..<endIdx])
  }

  func updateRemainingFileCapacity() {
    guard let lastResetDate = btSecureStorage.userState.dateLastPerformedFileCapacityReset else {
      btSecureStorage.dateLastPerformedFileCapacityReset = Date()
      btSecureStorage.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
      return
    }

    // Reset remainingDailyFileProcessingCapacity if 24 hours have elapsed since last detection
    if  Date.hourDifference(from: lastResetDate, to: Date()) > 24 {
      btSecureStorage.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
      btSecureStorage.dateLastPerformedFileCapacityReset = Date()
    }
  }

  @objc func fetchLastDetectionDate(resolve: @escaping RCTPromiseResolveBlock,
                             reject: @escaping RCTPromiseRejectBlock) {
    guard let lastDetectionDate = btSecureStorage.userState.lastExposureCheckDate else {
      let emError = ExposureManagerError(errorCode: .detectionNeverPerformed,
                                         localizedMessage: String.noLastResetDateAvailable.localized)
      reject(emError.errorCode, emError.localizedMessage, emError.underlyingError);
      return
    }
    let posixRepresentation = NSNumber(value: lastDetectionDate.posixRepresentation)
    resolve(posixRepresentation)
  }

  func getExposureConfigurationV1() -> Promise<ExposureConfigurationV1> {
    return Promise(on: .global()) { fullfill, _ in
      self.apiClient.downloadRequest(ExposureConfigurationV1Request.get,
                                     requestType: .exposureConfiguration) { (result) in
        var configuration = ExposureConfigurationV1.placeholder
        switch result {
        case.success(let exposureConfiguration):
          configuration = exposureConfiguration
          fullfill(configuration)
        case .failure(_):
          fullfill(configuration)
        }
      }
    }
  }

  ///Notifies the user that an exposure has been detected
  func notifyUserExposureDetected() {
    let content = UNMutableNotificationContent()
    content.title = String.newExposureNotificationTitle.localized
    content.body = String.newExposureNotificationBody.localized
    content.sound = .default
    content.userInfo = [String.notificationUrlKey: "\(String.notificationUrlBasePath)\(String.notificationUrlExposureHistoryPath)"]
    let request = UNNotificationRequest(identifier: String.newExposureNotificationIdentifier,
                                        content: content,
                                        trigger: nil)
    userNotificationCenter.add(request) { error in
      DispatchQueue.main.async {
        if let error = error {
          print("Error showing error user notification: \(error)")
        }
      }
    }
  }

}

// MARK: - Private

private extension ExposureManager {

  func activateSuccess() {
    awake()
    // Ensure exposure notifications are enabled. The app
    // could get into a state where it is authorized, but exposure
    // notifications are not enabled,  if the user initially denied Exposure Notifications
    // during onboarding, but then flipped on the "COVID-19 Exposure Notifications" switch
    // in Settings.
    if exposureNotificationStatus == .disabled {
      self.manager.setExposureNotificationEnabled(true) { _ in
        // No error handling for attempts to enable on launch
      }
    }
  }

  func broadcastCurrentExposureNotificationStatus() {
    notificationCenter.post(Notification(
      name: .ExposureNotificationStatusDidChange,
      object: self.exposureNotificationStatus.rawValue
    ))
  }

  func performChaffRequest() {
    fetchChaffKeys { [weak self] (keyArray, error) in
      if error != nil {
        print("error: \(error.debugDescription)")
      }
      self?.notificationCenter.post(Notification(
        name: .ChaffRequestTriggered,
        object: keyArray
      ))
    }
  }

  func getDiagnosisKeys<T>(transform: @escaping ([ENTemporaryExposureKey]?) -> T,
                           callback: @escaping (T?, ExposureManagerError?) -> Void) {
    manager.getDiagnosisKeys { (keys, error) in
      if let underlyingError = error {
        let emError = ExposureManagerError(errorCode: .noExposureKeysFound,
                                           localizedMessage: String.noLocalKeysFound.localized,
                                           underlyingError: underlyingError)
        callback(nil, emError)
      } else {
        callback(transform(keys), nil)
      }
    }
  }

  // MARK: == Exposure Detection Private Promises ==

  func fetchIndexFile() -> Promise<String> {
    return Promise<String> { fullfill, reject in
      self.apiClient.requestString(IndexFileRequest.get,
                              requestType: .downloadKeys) { result in
        switch result {
        case .success(let keyArchiveFilePathsString):
          fullfill(keyArchiveFilePathsString)
        case .failure(let error):
          reject(error)
        }
      }
    }
  }

  func downloadKeyArchives(targetUrls: [String]) -> Promise<[DownloadedPackage]> {
    return Promise { fullfill, reject in
      var downloadedPackages = [DownloadedPackage]()
      let dispatchGroup = DispatchGroup()
      for remoteURL in targetUrls {
        dispatchGroup.enter()
        self.apiClient.downloadRequest(KeyArchiveRequest.get(remoteURL),
                                       requestType: .downloadKeys) { result in
          switch result {
          case .success (let package):
            downloadedPackages.append(package)
          case .failure(let error):
            // The index file may list key archive URLs that have been deleted
            // from the key server. These will return 404's. Instead of aborting
            // the entire operation, we continue and download the key archives that
            // are present on the server
            if (error as? GenericError != GenericError.notFound) {
              reject(error)
            }
          }
          dispatchGroup.leave()
        }
      }
      dispatchGroup.notify(queue: .main) {
        fullfill(downloadedPackages)
      }
    }
  }

  func unpackKeyArchives(packages: [DownloadedPackage]) -> Promise<[URL]> {
    return Promise<[URL]>(on: .global()) { fullfill, reject in
      do {
        try packages.unpack({ (urls) in
          fullfill(urls)
        })
      } catch(let error) {
        reject(error)
      }
    }
  }

  func callDetectExposures(configuration: ENExposureConfiguration,
                           diagnosisKeyURLs: [URL]) -> Promise<ENExposureDetectionSummary?> {
    return Promise { fullfill, reject in
      self.manager.detectExposures(configuration: configuration,
                                   diagnosisKeyURLs: diagnosisKeyURLs) { summary, error in
        if let error = error {
          reject(error)
        } else {
          fullfill(summary)
        }
      }
    }
  }

  func getExposureInfoAndNotifyUser(summary: ENExposureDetectionSummary) -> Promise<[Exposure]> {
    return Promise { fullfill, reject in
      let userExplanation = NSLocalizedString(String.newExposureNotificationBody, comment: .default)
      self.manager.getExposureInfo(summary: summary,
                                   userExplanation: userExplanation) { exposures, error in
        if let error = error {
          reject(error)
        } else {
          let newExposures = (exposures ?? []).map { exposure in
            Exposure(id: UUID().uuidString,
                     date: exposure.date.posixRepresentation,
                     weightedDurationSum: exposure.duration)
          }
          fullfill(newExposures)
        }
      }
    }
  }
}

@available(iOS 13.7, *)
extension ExposureManager {

  // MARK: == Exposure Detection V2 Private Promises ==

  func getExposureConfigurationV2() -> Promise<DailySummariesConfiguration> {
    return Promise(on: .global())  { fullfill, _ in
      self.apiClient.downloadRequest(DailySummariesConfigurationRequest.get,
                                     requestType: .exposureConfiguration) { (result) in
        var configuration = DailySummariesConfiguration.placeholder
        switch result {
        case.success(let exposureConfiguration):
          configuration = exposureConfiguration
          fullfill(configuration)
        case .failure(_):
          fullfill(configuration)
        }
      }
    }
  }

  func getCachedExposures(configuration: ENExposureConfiguration) -> Promise<ENExposureDetectionSummary?> {
    return Promise(on: .global()) { fullfill, reject in
      self.manager.detectExposures(configuration: configuration) { summary, error in
        if let error = error {
          reject(error)
        } else {
          fullfill(summary)
        }
      }
    }
  }

}
