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
 This class wrapps [ENManager](https://developer.apple.com/documentation/exposurenotification/enmanager) and acts like a controller and entry point of the different flows
 */

final class ExposureManager: NSObject {

  private static let backgroundTaskIdentifier = "\(Bundle.main.bundleIdentifier!).exposure-notification"

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
    // Schedule background task if needed whenever EN authorization status changes
    notificationCenter.addObserver(
      self,
      selector: #selector(scheduleBackgroundTaskIfNeeded),
      name: .AuthorizationStatusDidChange,
      object: nil
    )
  }

  deinit {
    manager.invalidate()
  }

  /// Broadcast EN Status
  @objc func awake() {
    broadcastCurrentEnabledStatus()
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

  /// Requests the temporary exposure keys used by this device to share with a server. Returns an array of the exposures keys as dictionary or and error if the underlying API fails
  @objc func fetchExposureKeys(callback: @escaping (ExposureKeysDictionaryArray?, ExposureManagerError?) -> Void) {
    getDiagnosisKeys(transform: { (keys) -> ExposureKeysDictionaryArray in
      (keys ?? []).map { $0.asDictionary }
    }, callback: callback)
  }


  // MARK: == Exposure Detection ==

  /**
   Registers the background task of detecting exposures
    All launch handlers must be registered before application finishes launching
   */
  @objc func registerBackgroundTask() {
    bgTaskScheduler.register(forTaskWithIdentifier: ExposureManager.backgroundTaskIdentifier,
                             using: .main) { [weak self] task in
      guard let strongSelf = self else { return }
      // Notify the user if bluetooth is off
      strongSelf.notifyUserBlueToothOffIfNeeded()

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
      self?.scheduleBackgroundTaskIfNeeded()
    }
  }

  @objc func scheduleBackgroundTaskIfNeeded() {
    guard manager.exposureNotificationStatus == .active else { return }
    let taskRequest = BGProcessingTaskRequest(identifier: ExposureManager.backgroundTaskIdentifier)
    taskRequest.requiresNetworkConnectivity = true
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
      } else {
        self.broadcastCurrentEnabledStatus()
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
      let indexFileString = try await(self.fetchIndexFile())
      let remoteURLs = indexFileString.gaenFilePaths
      let targetUrls = self.urlPathsToProcess(remoteURLs, apiVersion: .V1)
      lastProcessedUrlPath = targetUrls.last ?? .default
      processedFileCount = targetUrls.count
      let downloadedKeyArchives = try await(self.downloadKeyArchives(targetUrls: targetUrls))
      unpackedArchiveURLs = try await(self.unpackKeyArchives(packages: downloadedKeyArchives))
      let exposureConfiguration = try await(self.getExposureConfigurationV1())
      let exposureSummary = try await(self.callDetectExposures(configuration: exposureConfiguration.asENExposureConfiguration,
                                                               diagnosisKeyURLs: unpackedArchiveURLs))
      var newExposures: [Exposure] = []
      if let summary = exposureSummary, summary.isAboveScoreThreshold(with: exposureConfiguration) {
        newExposures = try await(self.getExposureInfoAndNotifyUser(summary: summary))
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
      let indexFileString = try await(self.fetchIndexFile())
      let remoteURLs = indexFileString.gaenFilePaths
      let targetUrls = self.urlPathsToProcess(remoteURLs, apiVersion: .V2)
      lastProcessedUrlPath = targetUrls.last ?? .default
      processedFileCount = targetUrls.count
      let downloadedKeyArchives = try await(self.downloadKeyArchives(targetUrls: targetUrls))
      unpackedArchiveURLs = try await(self.unpackKeyArchives(packages: downloadedKeyArchives))
      let exposureConfiguraton = try await(self.getExposureConfigurationV2())
      let exposureSummary = try await(self.callDetectExposures(configuration: exposureConfiguraton.asENExposureConfiguration,
                                                               diagnosisKeyURLs: unpackedArchiveURLs))
      var newExposures: [Exposure] = []
      if let summary = exposureSummary {
        summary.daySummaries.forEach { (daySummary) in
          if daySummary.isAboveScoreThreshold(with: exposureConfiguraton) &&
              self.btSecureStorage.canStoreExposure(for: daySummary.date) {
            let exposure = Exposure(id: UUID().uuidString,
                                    date: daySummary.date.posixRepresentation)
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

  func broadcastCurrentEnabledStatus() {
    notificationCenter.post(Notification(
      name: .AuthorizationStatusDidChange,
      object: self.exposureNotificationStatus.rawValue
    ))
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
        self.apiClient.downloadRequest(DiagnosisKeyUrlRequest.get(remoteURL),
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
                     date: exposure.date.posixRepresentation)
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
