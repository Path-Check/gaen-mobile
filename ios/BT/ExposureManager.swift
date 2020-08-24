import Foundation
import ExposureNotification
import RealmSwift
import UserNotifications
import BackgroundTasks

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

@objc(ExposureManager)
/**
 This class wrapps [ENManager](https://developer.apple.com/documentation/exposurenotification/enmanager) and acts like a controller and entry point of the different flows
 */

final class ExposureManager: NSObject {

  private static let backgroundTaskIdentifier = "\(Bundle.main.bundleIdentifier!).exposure-notification"

  private var exposureConfiguration = ExposureConfiguration.placeholder

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
  public let keychainService: KeychainService

  init(exposureNotificationManager: ExposureNotificationManager = ENManager(),
       apiClient: APIClient = BTAPIClient.shared,
       btSecureStorage: BTSecureStorage = BTSecureStorage.shared,
       backgroundTaskScheduler: BackgroundTaskScheduler = BGTaskScheduler.shared,
       notificationCenter: NotificationCenter = NotificationCenter.default,
       userNotificationCenter: UserNotificationCenter = UNUserNotificationCenter.current(),
       keychainService: KeychainService = DefaultKeychainService.shared) {
    self.manager = exposureNotificationManager
    self.apiClient = apiClient
    self.btSecureStorage = btSecureStorage
    self.bgTaskScheduler = backgroundTaskScheduler
    self.notificationCenter = notificationCenter
    self.userNotificationCenter = userNotificationCenter
    self.keychainService = keychainService
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
  
  /// Broadcast EN Status and fetch exposure configuration
  @objc func awake() {
    fetchExposureConfiguration()
    broadcastCurrentEnabledStatus()
  }

  // MARK: == State ==

  enum EnabledState: String {
    case enabled = "ENABLED"
    case disabled = "DISABLED"
  }
  
  enum AuthorizationState: String {
    case authorized = "AUTHORIZED"
    case unauthorized = "UNAUTHORIZED"
  }

  /// Wrapps ENManager enabled state to a enabled/disabled state
  var enabledState: EnabledState {
    return manager.exposureNotificationEnabled ? .enabled : .disabled
  }

  /// Wrapps ENManager authorization state to a authorized/unauthorized state
  var authorizationState: AuthorizationState {
    return (manager.authorizationStatus() == .authorized) ? .authorized : .unauthorized
  }

  /// Wrapps ENManager state and determines if bluetooth is on or off
  /// (bluetoothOff)[https://developer.apple.com/documentation/exposurenotification/enstatus/bluetoothoff]
  @objc var isBluetoothEnabled: Bool {
    manager.exposureNotificationStatus != .bluetoothOff
  }

  ///Returns both the current authorizationState and enabledState as Strings
  @objc func getCurrentENPermissionsStatus(callback: @escaping (String, String) -> Void) {
    callback(authorizationState.rawValue, enabledState.rawValue)
  }

  ///Requests enabling Exposure Notifications to the underlying manager, if success, it broadcasts the new status, if not, it returns and error
  @objc func requestExposureNotificationAuthorization(enabled: Bool,
                                                      callback: @escaping (ExposureManagerError?) -> Void) {
    // Ensure exposure notifications are enabled if the app is authorized. The app
    // could get into a state where it is authorized, but exposure
    // notifications are not enabled,  if the user initially denied Exposure Notifications
    // during onboarding, but then flipped on the "COVID-19 Exposure Notifications" switch
    // in Settings.
    manager.setExposureNotificationEnabled(enabled) { error in
      if let underlyingError = error {
        let emError = ExposureManagerError(errorCode: .cannotEnableNotifications,
                             localizedMessage: String.cannotEnableNotifications.localized,
                             underlyingError: underlyingError)
        callback(emError)
      } else {
        self.broadcastCurrentEnabledStatus()
        callback(nil)
      }
    }
  }

  /// Returns the current exposures as a json string representation
  @objc var currentExposures: String {
    return Array(btSecureStorage.userState.exposures).jsonStringRepresentation()
  }

  ///Notifies the user to enable bluetooth to be able to exchange keys
  func notifyUserBlueToothOffIfNeeded() {
    let identifier = String.bluetoothNotificationIdentifier
    // Bluetooth must be enabled in order for the device to exchange keys with other devices
    if manager.authorizationStatus() == .authorized && manager.exposureNotificationStatus == .bluetoothOff {
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

  @objc func getAndPostDiagnosisKeys(certificate: String,
                                     HMACKey: String,
                                     callback: @escaping (String?, ExposureManagerError?) -> Void) {
    getDiagnosisKeys(transform: { (temporaryExposureKeys) -> [ENTemporaryExposureKey] in
      let allKeys = (temporaryExposureKeys ?? [])
      // Filter keys > 350 hrs old
      return allKeys.current()
    }) { [weak self] (currentKeys, error) in
      guard let strongSelf = self else { return }
      if let error = error {
        return callback(nil, error)
      }
      guard let keysToSubmit = currentKeys, !keysToSubmit.isEmpty else {
        let emError = ExposureManagerError(errorCode: .noExposureKeysFound,
                                           localizedMessage: String.noLocalKeysFound.localized,
                                           underlyingError: GenericError.unknown)
        return callback(nil, emError)
      }
      let regionCodes = ReactNativeConfig.env(for: .regionCodes)!.regionCodes
      let revisionToken = strongSelf.keychainService.revisionToken
      strongSelf.apiClient.request(DiagnosisKeyListRequest.post(keysToSubmit.compactMap { $0.asCodableKey },
                                                          regionCodes,
                                                          certificate,
                                                          HMACKey,
                                                          revisionToken),
                             requestType: .postKeys) { result in
                                switch result {
                                case .success(let response):
                                  // Save revisionToken to use on subsequent key submission requests
                                  strongSelf.keychainService.setRevisionToken(response.revisionToken ?? .default)
                                  callback("Submitted: \(keysToSubmit.count) keys.", nil)
                                case .failure(let error):
                                  let emError = ExposureManagerError(errorCode: .networkFailure,
                                                                     localizedMessage: error.localizedDescription,
                                                                     underlyingError: error)
                                  callback(nil, emError)
                              }
      }
    }
  }

  /**
   Registers the background task of detecting exposures
    All launch handlers must be registered before application finishes launching
   */
  @objc func registerBackgroundTask() {
    _ = bgTaskScheduler.register(forTaskWithIdentifier: ExposureManager.backgroundTaskIdentifier,
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
    guard manager.authorizationStatus() == .authorized else { return }
    let taskRequest = BGProcessingTaskRequest(identifier: ExposureManager.backgroundTaskIdentifier)
    taskRequest.requiresNetworkConnectivity = true
    do {
      try bgTaskScheduler.submit(taskRequest)
    } catch {
      print("Unable to schedule background task: \(error)")
    }
  }

  private var isDetectingExposures = false
  
  /// Downloaded archives from the GAEN server
  private var downloadedPackages = [DownloadedPackage]()
  
  /// Local urls of the bin/sig files from each archive
  private var localUncompressedURLs = [URL]()

  @discardableResult func detectExposures(completionHandler: @escaping ((ExposureResult) -> Void)) -> Progress {
    
    let progress = Progress()
    
    var lastProcessedUrlPath: String = .default
    var processedFileCount: Int = 0

    // Disallow concurrent exposure detection,
    // because if allowed we might try to detect the same diagnosis keys more than once
    guard !isDetectingExposures else {
      finish(
        .failure(ExposureError.default("Detection Already in Progress")),
        processedFileCount: processedFileCount,
        lastProcessedUrlPath: lastProcessedUrlPath,
        progress: progress,
        completionHandler: completionHandler
      )
      return progress
    }

    isDetectingExposures = true

    // Reset file capacity to 15 if > 24 hours have elapsed since last reset
    self.updateRemainingFileCapacity()

    // Abort if daily file capacity is exceeded
    guard btSecureStorage.userState.remainingDailyFileProcessingCapacity > 0 else {
      finish(
        .success([]),
        processedFileCount: processedFileCount,
        lastProcessedUrlPath: lastProcessedUrlPath,
        progress: progress,
        completionHandler: completionHandler
      )
      return progress
    }

    apiClient.requestString(IndexFileRequest.get, requestType: .downloadKeys) { result in
      let dispatchGroup = DispatchGroup()

      switch result {
      case let .success(indexFileString):
        let remoteURLs = indexFileString.gaenFilePaths
        let targetUrls = self.urlPathsToProcess(remoteURLs)
        lastProcessedUrlPath = targetUrls.last ?? .default
        processedFileCount = targetUrls.count
        for remoteURL in targetUrls {
          dispatchGroup.enter()
          self.apiClient.downloadRequest(DiagnosisKeyUrlRequest.get(remoteURL), requestType: .downloadKeys) { result in
            switch result {
            case .success (let package):
              self.downloadedPackages.append(package)
            case .failure(let error):
              self.finish(.failure(error),
                          processedFileCount: processedFileCount,
                          lastProcessedUrlPath: lastProcessedUrlPath,
                          progress: progress,
                          completionHandler: completionHandler)
              return
            }
            dispatchGroup.leave()
          }
        }

      case let .failure(error):
        self.finish(.failure(error),
                    processedFileCount: processedFileCount,
                    lastProcessedUrlPath: lastProcessedUrlPath,
                    progress: progress,
                    completionHandler: completionHandler)
        return
      }
      dispatchGroup.notify(queue: .main) {
        do {
          try self.downloadedPackages.unpack { urls in
            self.localUncompressedURLs = urls

            // TODO: Fetch configuration from API
            let enConfiguration = ExposureConfiguration.placeholder.asENExposureConfiguration
            _ = self.manager.detectExposures(configuration: enConfiguration,
                                             diagnosisKeyURLs: self.localUncompressedURLs) { summary, error in
              if let error = error {
                self.finish(.failure(error),
                            processedFileCount: processedFileCount,
                            lastProcessedUrlPath: lastProcessedUrlPath,
                            progress: progress,
                            completionHandler: completionHandler)
                return
              }
              let userExplanation = NSLocalizedString(String.newExposureNotificationBody, comment: .default)
              _ = self.manager.getExposureInfo(summary: summary!,
                                               userExplanation: userExplanation) { exposures, error in
                if let error = error {
                  self.finish(.failure(error),
                              processedFileCount: processedFileCount,
                              lastProcessedUrlPath: lastProcessedUrlPath,
                              progress: progress,
                              completionHandler: completionHandler)
                  return
                }
                let newExposures = (exposures ?? []).map { exposure in
                  Exposure(id: UUID().uuidString,
                           date: exposure.date.posixRepresentation,
                           duration: exposure.duration,
                           totalRiskScore: exposure.totalRiskScore,
                           transmissionRiskLevel: exposure.transmissionRiskLevel)
                }
                self.finish(.success(newExposures),
                            processedFileCount: processedFileCount,
                            lastProcessedUrlPath: lastProcessedUrlPath,
                            progress: progress,
                            completionHandler: completionHandler)
              }
            }
          }
        } catch(let error) {
          self.finish(.failure(error),
                      processedFileCount: processedFileCount,
                      lastProcessedUrlPath: lastProcessedUrlPath,
                      progress: progress,
                      completionHandler: completionHandler)
        }
      }
    }
    return progress
  }
  
  func finish(_ result: Result<[Exposure]>,
              processedFileCount: Int,
              lastProcessedUrlPath: String,
              progress: Progress,
              completionHandler: ((ExposureResult) -> Void)) {
    
    cleanup()
    
    isDetectingExposures = false
    
    if progress.isCancelled {
      btSecureStorage.exposureDetectionErrorLocalizedDescription = GenericError.unknown.localizedDescription
      completionHandler(.failure(ExposureError.cancelled))
    } else {
      switch result {
      case let .success(newExposures):
        btSecureStorage.exposureDetectionErrorLocalizedDescription = .default
        btSecureStorage.remainingDailyFileProcessingCapacity -= processedFileCount
        if lastProcessedUrlPath != .default {
          btSecureStorage.urlOfMostRecentlyDetectedKeyFile = lastProcessedUrlPath
        }
        btSecureStorage.storeExposures(newExposures)
        completionHandler(.success(processedFileCount))
      case let .failure(error):
        let exposureError = ExposureError.default(error.localizedDescription)
        btSecureStorage.exposureDetectionErrorLocalizedDescription = error.localizedDescription
        postExposureDetectionErrorNotification(exposureError.errorDescription)
        completionHandler(.failure(exposureError))
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
  
  func urlPathsToProcess(_ urlPaths: [String]) -> [String] {
    let startIdx = startIndex(for: urlPaths)
    let endIdx = min(startIdx + btSecureStorage.userState.remainingDailyFileProcessingCapacity, urlPaths.count)
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
  
  @objc func fetchLastDetectionDate(callback: (NSNumber?, ExposureManagerError?) -> Void)  {
   guard let lastResetDate = btSecureStorage.userState.dateLastPerformedFileCapacityReset else {
    let emError = ExposureManagerError(errorCode: .detectionNeverPerformed,
                                       localizedMessage: String.noLastResetDateAvailable.localized)
    return callback(nil, emError)
    }
    let posixRepresentation = NSNumber(value: lastResetDate.posixRepresentation)
    return callback(posixRepresentation, nil)
  }
}

// MARK: - Private

private extension ExposureManager {

  func activateSuccess() {
    awake()
    // Ensure exposure notifications are enabled if the app is authorized. The app
    // could get into a state where it is authorized, but exposure
    // notifications are not enabled,  if the user initially denied Exposure Notifications
    // during onboarding, but then flipped on the "COVID-19 Exposure Notifications" switch
    // in Settings.
    if authorizationState == .authorized && enabledState == .disabled {
      self.manager.setExposureNotificationEnabled(true) { _ in
        // No error handling for attempts to enable on launch
      }
    }
  }

  func fetchExposureConfiguration() {
    apiClient.request(ExposureConfigurationRequest.get,
                      requestType: .exposureConfiguration) { [weak self] result in
      switch result {
      case .success(let exposureConfiguration):
        self?.exposureConfiguration = exposureConfiguration
      case .failure(let error):
        print("Error fetching exposure configuration: \(error)")
      }
    }
  }
  
  func broadcastCurrentEnabledStatus() {
    notificationCenter.post(Notification(
      name: .AuthorizationStatusDidChange,
      object: [self.authorizationState.rawValue, self.enabledState.rawValue]
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

  func cleanup() {
    // Delete downloaded files from file system
    localUncompressedURLs.cleanup()
    localUncompressedURLs = []
    downloadedPackages = []
  }
}
