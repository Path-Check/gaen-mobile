import Foundation
import ExposureNotification
import RealmSwift
import UserNotifications
import BackgroundTasks

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

  fileprivate let manager: ExposureNotificationManager
  private let apiClient: APIClient
  private let btSecureStorage: BTSecureStorage
  private let bgTaskScheduler: BGTaskScheduler
  private let notificationCenter: NotificationCenter

  init(exposureNotificationManager: ExposureNotificationManager = ENManager(),
       apiClient: APIClient = BTAPIClient.shared,
       btSecureStorage: BTSecureStorage = BTSecureStorage.shared,
       backgroundTaskScheduler: BGTaskScheduler = BGTaskScheduler.shared,
       notificationCenter: NotificationCenter = NotificationCenter.default) {
    self.manager = exposureNotificationManager
    self.apiClient = apiClient
    self.btSecureStorage = btSecureStorage
    self.bgTaskScheduler = backgroundTaskScheduler
    self.notificationCenter = notificationCenter
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
  @objc func requestExposureNotificationAuthorization(enabled: Bool, callback: @escaping (Error?) -> Void) {
    // Ensure exposure notifications are enabled if the app is authorized. The app
    // could get into a state where it is authorized, but exposure
    // notifications are not enabled,  if the user initially denied Exposure Notifications
    // during onboarding, but then flipped on the "COVID-19 Exposure Notifications" switch
    // in Settings.
    manager.setExposureNotificationEnabled(enabled) { error in
      if let error = error {
        callback(error)
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

  private var isDetectingExposures = false
  
  /// Downloaded archives from the GAEN server
  private var downloadedPackages = [DownloadedPackage]()
  
  /// Local urls of the bin/sig files from each archive
  private var localUncompressedURLs = [URL]()

  @discardableResult func detectExposures(completionHandler: @escaping ((ExposureResult) -> Void)) -> Progress {
    
    let progress = Progress()
    
    var lastProcessedUrlPath: String = .default
    var processedFileCount: Int = 0

    // Disallow concurrent exposure detection, because if allowed we might try to detect the same diagnosis keys more than once
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
    ExposureManager.updateRemainingFileCapacity()

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
        let targetUrls = ExposureManager.urlPathsToProcess(remoteURLs)
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
            _ = self.manager.detectExposures(configuration: enConfiguration, diagnosisKeyURLs: self.localUncompressedURLs) { summary, error in
              if let error = error {
                self.finish(.failure(error),
                            processedFileCount: processedFileCount,
                            lastProcessedUrlPath: lastProcessedUrlPath,
                            progress: progress,
                            completionHandler: completionHandler)
                return
              }
              let userExplanation = NSLocalizedString(String.newExposureNotificationBody, comment: .default)
              _ = self.manager.getExposureInfo(summary: summary!, userExplanation: userExplanation) { exposures, error in
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
      BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = GenericError.unknown.localizedDescription
      completionHandler(.failure(ExposureError.cancelled))
    } else {
      switch result {
      case let .success(newExposures):
        BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = .default
        BTSecureStorage.shared.remainingDailyFileProcessingCapacity -= processedFileCount
        if lastProcessedUrlPath != .default {
          BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = lastProcessedUrlPath
        }
        BTSecureStorage.shared.storeExposures(newExposures)
        completionHandler(.success(processedFileCount))
      case let .failure(error):
        let exposureError = ExposureError.default(error.localizedDescription)
        BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = error.localizedDescription
        postExposureDetectionErrorNotification(exposureError.errorDescription)
        completionHandler(.failure(exposureError))
      }
    }
  }

  /**
    All launch handlers must be registered before application finishes launching
   */
  @objc func registerBackgroundTask() {
    BGTaskScheduler.shared.register(forTaskWithIdentifier: ExposureManager.backgroundTaskIdentifier, using: .main) { [weak self] task in
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
      try BGTaskScheduler.shared.submit(taskRequest)
    } catch {
      print("Unable to schedule background task: \(error)")
    }
  }
  
  @objc func getAndPostDiagnosisKeys(certificate: String,
                                     HMACKey: String,
                                     resolve: @escaping RCTPromiseResolveBlock,
                                     reject: @escaping RCTPromiseRejectBlock) {
    manager.getDiagnosisKeys { temporaryExposureKeys, error in
      if let error = error {
        reject(String.noExposureKeysFound, "Failed to get exposure keys", error)
      } else {
        
        let allKeys = (temporaryExposureKeys ?? [])
        
        guard !allKeys.isEmpty else {
          reject(String.noExposureKeysFound, String.noLocalKeysFound.localized, GenericError.unknown)
          return
        }
        
        // Filter keys > 350 hrs old
        let currentKeys = allKeys.current()
        
        let regionCodes = ReactNativeConfig.env(for: .regionCodes)!.regionCodes

        let revisionToken = BTSecureStorage.shared.userState.revisionToken
        
        self.apiClient.request(DiagnosisKeyListRequest.post(currentKeys.compactMap { $0.asCodableKey }, regionCodes, certificate, HMACKey, revisionToken),
                                 requestType: .postKeys) { result in
                                  switch result {
                                  case .success(let response):
                                    // Save revisionToken to use on subsequent key submission requests
                                    BTSecureStorage.shared.revisionToken = response.revisionToken ?? .default
                                    resolve("Submitted: \(currentKeys.count) keys.")
                                  case .failure(let error):
                                    reject(String.networkFailure, "Failed to post exposure keys \(error.localizedDescription)", error)
                                  }
        }
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
    UNUserNotificationCenter.current().add(request) { error in
      DispatchQueue.main.async {
        if let error = error {
          print("Error showing error user notification: \(error)")
        }
      }
    }
    #endif
  }
  
  @objc func fetchExposureKeys(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    manager.getDiagnosisKeys { (keys, error) in
      if let error = error {
        reject(String.noExposureKeysFound, "There was an error fetching the exposure keys \(error)", error);
      } else {
        resolve((keys ?? []).map { $0.asDictionary })
      }
    }
  }
}

// MARK: - FileProcessing

extension ExposureManager {
  
  static func startIndex(for urlPaths: [String]) -> Int {
    let path = BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile
    if let lastIdx = urlPaths.firstIndex(of: path) {
      return min(lastIdx + 1, urlPaths.count)
    }
    return 0
  }
  
  static func urlPathsToProcess(_ urlPaths: [String]) -> [String] {
    let startIdx = startIndex(for: urlPaths)
    let endIdx = min(startIdx + BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, urlPaths.count)
    return Array(urlPaths[startIdx..<endIdx])
  }
  
  static func updateRemainingFileCapacity() {
    guard let lastResetDate =  BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset else {
      BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
      BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
      return
    }
    
    // Reset remainingDailyFileProcessingCapacity if 24 hours have elapsed since last detection
    if  Date.hourDifference(from: lastResetDate, to: Date()) > 24 {
      BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
      BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
    }
  }
  
  @objc func fetchLastDetectionDate(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let lastResetDate = BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset else {
      reject(.detectionNeverPerformed, "No lastResetDate available", GenericError.unknown);
      return
    }
    resolve(lastResetDate.posixRepresentation)
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
    apiClient.request(ExposureConfigurationRequest.get, requestType: .exposureConfiguration) { [weak self] result in
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
  
  func notifyUserBlueToothOffIfNeeded() {
    let identifier = String.bluetoothNotificationIdentifier
    
    // Bluetooth must be enabled in order for the device to exchange keys with other devices
    if manager.authorizationStatus() == .authorized && manager.exposureNotificationStatus == .bluetoothOff {
      let content = UNMutableNotificationContent()
      content.title = String.bluetoothNotificationTitle.localized
      content.body = String.bluetoothNotificationBody.localized
      content.sound = .default
      let request = UNNotificationRequest(identifier: identifier, content: content, trigger: nil)
      UNUserNotificationCenter.current().add(request) { error in
        DispatchQueue.main.async {
          if let error = error {
            print("Error showing error user notification: \(error)")
          }
        }
      }
    } else {
      UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: [identifier])
    }
  }
  
  func cleanup() {
    // Delete downloaded files from file system
    localUncompressedURLs.cleanup()
    localUncompressedURLs = []
    downloadedPackages = []
  }
}

protocol ExposureManagerDebuggable {
  func handleDebugAction(_ action: DebugAction,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock)
}

extension ExposureManager: ExposureManagerDebuggable {

  @objc func handleDebugAction(_ action: DebugAction,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
    switch action {
    case .fetchDiagnosisKeys:
      manager.getDiagnosisKeys { (keys, error) in
        if let error = error {
          reject(error.localizedDescription, "Failed to get exposure keys", error)
        } else {
          resolve(keys!.map { $0.asDictionary })
        }
      }
    case .detectExposuresNow:
      guard btSecureStorage.userState.remainingDailyFileProcessingCapacity > 0 else {
        let hoursRemaining = 24 - Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset ?? Date(), to: Date())
        reject("Time window Error.", "You have reached the exposure file submission limit. Please wait \(hoursRemaining) hours before detecting exposures again.", GenericError.unknown)
        return
      }

      detectExposures { result in
        switch result {
        case .success(let numberOfFilesProcessed):
          resolve("Exposure detection successfully executed. Processed \(numberOfFilesProcessed) files.")
        case .failure(let exposureError):
          reject(exposureError.localizedDescription, exposureError.errorDescription, exposureError)
        }
      }
    case .simulateExposureDetectionError:
      btSecureStorage.exposureDetectionErrorLocalizedDescription = "Unable to connect to server."
      postExposureDetectionErrorNotification("Simulated Error")
      resolve(String.genericSuccess)
    case .simulateExposure:
      let exposure = Exposure(id: UUID().uuidString,
                              date: Date().posixRepresentation - Int(TimeInterval.random(in: 0...13)) * 24 * 60 * 60 * 1000,
                              duration: TimeInterval(1),
                              totalRiskScore: .random(in: 1...8),
                              transmissionRiskLevel: .random(in: 0...7))
      btSecureStorage.storeExposures([exposure])
      let content = UNMutableNotificationContent()
      content.title = String.newExposureNotificationTitle.localized
      content.body = String.newExposureNotificationBody.localized
      content.sound = .default
      let request = UNNotificationRequest(identifier: "identifier", content: content, trigger: nil)
      UNUserNotificationCenter.current().add(request) { error in
        DispatchQueue.main.async {
          if let error = error {
            print("Error showing error user notification: \(error)")
          }
        }
      }
      resolve("Exposures: \(btSecureStorage.userState.exposures)")
    case .fetchExposures:
      resolve(currentExposures)
    case .getAndPostDiagnosisKeys:
      getAndPostDiagnosisKeys(certificate: .default, HMACKey: .default, resolve: resolve, reject: reject)
    case .resetExposures:
      btSecureStorage.exposures = List<Exposure>()
      resolve("Exposures: \(btSecureStorage.exposures.count)")
    case .toggleENAuthorization:
      let enabled = manager.exposureNotificationEnabled ? false : true
      requestExposureNotificationAuthorization(enabled: enabled) { result in
        resolve("EN Enabled: \(self.manager.exposureNotificationEnabled)")
      }
    case .showLastProcessedFilePath:
      let path = btSecureStorage.userState.urlOfMostRecentlyDetectedKeyFile
      resolve(path)
    }
  }
}
