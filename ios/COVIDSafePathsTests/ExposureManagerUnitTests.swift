import Foundation
import UserNotifications
import BackgroundTasks
import ExposureNotification
import Promises
import XCTest

@testable import BT

// MARK: == Mocks ==

class MockENExposureDetectionSummary: ENExposureDetectionSummary {
  
  var matchedKeyCountHandler: (() -> UInt64)?
  var attenuationDurationsHandler: (() -> [NSNumber])?
  
  override var matchedKeyCount: UInt64 {
    return matchedKeyCountHandler?() ?? 0
  }
  
  override var attenuationDurations: [NSNumber] {
    return attenuationDurationsHandler?() ?? [0,0,0]
  }
  
  override var riskScoreSumFullRange: Double {
    return 0
  }
  
  @available(iOS 13.7, *)
  override var daySummaries: [ENExposureDaySummary] {
    let enExposureSummary = ENExposureDaySummary()
    return [enExposureSummary]
  }
}

@available(iOS 13.7, *)
class MockDaySummariesENExposureDetectionSummary: MockENExposureDetectionSummary {
  
  var daySummariesHandler: (() -> [ENExposureDaySummary])?
  
  override var daySummaries: [ENExposureDaySummary] {
    return daySummariesHandler?() ?? []
  }
}

class MockENExposureInfo: ENExposureInfo {
  
  override var date: Date {
    return Date()
  }
}

@available(iOS 13.7, *)
class MockENExposureDaySummary: ENExposureDaySummary {
  
  override var date: Date {
    return XCTestCase.halloween
  }
  
  var daySummaryHandler: (() -> ENExposureSummaryItem)?
  override var daySummary: ENExposureSummaryItem {
    return daySummaryHandler?() ?? ENExposureSummaryItem()
  }
}

@available(iOS 13.7, *)
class MockENExposureSummaryItem: ENExposureSummaryItem {
  
  var weightedDurationSumHandler: (() -> TimeInterval)?
  
  override var weightedDurationSum: TimeInterval {
    return weightedDurationSumHandler?() ?? 0
  }
}



class MockDownloadedPackage: DownloadedPackage {
  
  var handler: () throws -> URL
  
  init(handler: @escaping () throws -> URL) {
    self.handler = handler
    super.init(keysBin: Data(), signature: Data())
  }
  
  override func writeSignatureEntry(toDirectory directory: URL, filename: String) throws -> URL {
    return try handler()
  }
  
  override func writeKeysEntry(toDirectory directory: URL, filename: String) throws -> URL {
    return try handler()
  }
  
  
}

class KeychainServiceMock: KeychainService {
  
  var setRevisionTokenHandler: ((String) -> Void)?
  
  func setRevisionToken(_ token: String) {
    setRevisionTokenHandler?(token)
  }
  
  var revisionToken: String {
    return "revisionToken"
  }
  
}

class BTSecureStorageMock: BTSecureStorage {
  
  var userStateHandler: (() -> UserState)?
  var storeExposuresHandler: (([Exposure]) -> Void)?
  init(notificationCenter: NotificationCenter) {
    super.init(inMemory: true, notificationCenter: notificationCenter)
  }
  
  override var userState: UserState {
    return userStateHandler?() ?? super.userState
  }
  
  override func storeExposures(_ exposures: [Exposure]) {
    storeExposuresHandler?(exposures)
  }
}

class APIClientMock: APIClient {
  
  var requestHander: (Any, RequestType) -> (Any)
  var downloadRequestHander: ((Any, RequestType) -> (Any))?
  
  init(requestHander: @escaping (Any, RequestType) -> (Any)) {
    self.requestHander = requestHander
  }
  
  static var documentsDirectory: URL? {
    return nil
  }
  
  func downloadRequest<T>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T : APIRequest, T.ResponseType : DownloadableFile {
    completion(downloadRequestHander!(request, requestType) as! GenericResult<T.ResponseType>)
  }
  
  func request<T>(_ request: T, requestType: RequestType, completion: @escaping GenericCompletion) where T : APIRequest, T.ResponseType == Void {
    
  }
  
  func request<T>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<JSONObject>) -> Void) where T : APIRequest, T.ResponseType == JSONObject {
  }
  
  func request<T>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T : APIRequest, T.ResponseType : Decodable {
    completion(requestHander(request, requestType) as! GenericResult<T.ResponseType>)
  }
  
  func requestList<T>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<[T.ResponseType.Element]>) -> Void) where T : APIRequest, T.ResponseType : Collection, T.ResponseType.Element : Decodable {
    
  }
  
  func requestString<T>(_ request: T, requestType: RequestType, completion: @escaping (GenericResult<T.ResponseType>) -> Void) where T : APIRequest, T.ResponseType == String {
    completion(requestHander(request, requestType) as! GenericResult<T.ResponseType>)
  }
  
  func cancelAllRequests() {
    
  }
}

class NotificationCenterMock: NotificationCenter {
  
  var addObserverHandler: ((_ observer: Any,
                            _ aSelector: Selector,
                            _ aName: NSNotification.Name?,
                            _ anObject: Any?) -> Void)?
  var postHandler: ((_ notification: Notification) -> Void)?
  
  override func addObserver(_ observer: Any,
                            selector aSelector: Selector,
                            name aName: NSNotification.Name?,
                            object anObject: Any?) {
    addObserverHandler?(observer, aSelector, aName, anObject)
  }
  
  override func post(_ notification: Notification) {
    postHandler?(notification)
  }
}

class ENManagerMock: ExposureNotificationManager {
  var detectExposuresHandler: ((_ configuration: ENExposureConfiguration,
                                _ completionHandler: @escaping ENDetectExposuresHandler) -> Progress)?
  
  func detectExposures(configuration: ENExposureConfiguration, completionHandler: @escaping ENDetectExposuresHandler) -> Progress {
    return detectExposuresHandler?(configuration, completionHandler) ?? Progress()
  }
  
  @available(iOS 13.7, *)
  func getExposureWindows(summary: ENExposureDetectionSummary,
                          completionHandler: @escaping ENGetExposureWindowsHandler) -> Progress {
    return Progress()
  }
  
  
  var activateHandler: ((_ completionHandler: @escaping ENErrorHandler) -> Void)?
  var invalidateHandler: (() -> Void)?
  var setExposureNotificationEnabledHandler: ((_ enabled: Bool, _ completionHandler: @escaping ENErrorHandler) -> Void)?
  var exposureNotificationStatusHandler: (() -> ENStatus)?
  var getDiagnosisKeysHandler: ((ENGetDiagnosisKeysHandler) -> ())?
  var enDetectExposuresHandler: ((_ configuration: ENExposureConfiguration, _ diagnosisKeyURLs: [URL], _ completionHandler: @escaping ENDetectExposuresHandler) -> Progress)?
  var getExposureInfoHandler: ((_ summary: ENExposureDetectionSummary, _ userExplanation: String, _ completionHandler: @escaping ENGetExposureInfoHandler) -> Progress)?
  var dispatchQueue: DispatchQueue = DispatchQueue.main
  
  var invalidationHandler: (() -> Void)?

  func detectExposures(configuration: ENExposureConfiguration, diagnosisKeyURLs: [URL], completionHandler: @escaping ENDetectExposuresHandler) -> Progress {
    return enDetectExposuresHandler?(configuration, diagnosisKeyURLs, completionHandler) ?? Progress()
  }
  
  func getExposureInfo(summary: ENExposureDetectionSummary, userExplanation: String, completionHandler: @escaping ENGetExposureInfoHandler) -> Progress {
    return getExposureInfoHandler?(summary, userExplanation, completionHandler) ?? Progress()
  }
  
  func getDiagnosisKeys(completionHandler: @escaping ENGetDiagnosisKeysHandler) {
    getDiagnosisKeysHandler?(completionHandler)
  }
  
  func getTestDiagnosisKeys(completionHandler: @escaping ENGetDiagnosisKeysHandler) {
    
  }
  
  var exposureNotificationStatus: ENStatus {
    return exposureNotificationStatusHandler?() ?? .unknown
  }
  
  func activate(completionHandler: @escaping ENErrorHandler) {
    activateHandler?(completionHandler)
  }
  
  func invalidate() {
    invalidateHandler?()
  }
  
  func setExposureNotificationEnabled(_ enabled: Bool, completionHandler: @escaping ENErrorHandler) {
    setExposureNotificationEnabledHandler?(enabled, completionHandler)
  }
}

class BGTaskSchedulerMock: BackgroundTaskScheduler {
  
  var registerHandler: ((_ identifier: String, _ launchHandler: @escaping (BGTask) -> Void) -> Bool)?
  var submitHandler: ((_ taskRequest: BGTaskRequest) -> Void)?
  
  func register(forTaskWithIdentifier identifier: String,
                using queue: DispatchQueue?,
                launchHandler: @escaping (BGTask) -> Void) -> Bool {
    return registerHandler?(identifier, launchHandler) ?? false
  }
  
  func submit(_ taskRequest: BGTaskRequest) throws {
    submitHandler?(taskRequest)
  }
}

class UNUserNotificationCenterMock: UserNotificationCenter {
  
  var addHandler: ((_ request: UNNotificationRequest, _ completionHandler: ((Error?) -> Void)?) -> Void)?
  var removeDeliveredNotificationsHandler: ((_ identifiers: [String]) -> Void)?
  
  func add(_ request: UNNotificationRequest, withCompletionHandler completionHandler: ((Error?) -> Void)?) {
    addHandler?(request, completionHandler)
  }
  
  func removeDeliveredNotifications(withIdentifiers identifiers: [String]) {
    removeDeliveredNotificationsHandler?(identifiers)
  }
}

// MARK: == UNIT TESTS ==

class ExposureManagerUnitTests: XCTestCase {
  
  func testCreatesSharedInstance() {
    ExposureManager.createSharedInstance()
    XCTAssertNotNil(ExposureManager.shared)
  }
  
  func testLifecycle() {
    let mockENManager = ENManagerMock()
    let activateExpectation = self.expectation(description: "Activate gets called")
    let invalidateExpectation = self.expectation(description: "Invalidate gets called")
    
    let registerNotificationExpectation = self.expectation(description: "Registers for authorization changes")
    
    let setExposureNotificationEnabledTrueExpectation = self.expectation(description: "When activated, if disabled, request to enable exposure notifications")
    
    let notificationCenterMock = NotificationCenterMock()
    notificationCenterMock.addObserverHandler = { (_, _, name, _) in
      if name == Notification.Name.AuthorizationStatusDidChange {
        registerNotificationExpectation.fulfill()
      }
    }
    
    mockENManager.activateHandler = { completionHandler in
      mockENManager.exposureNotificationStatusHandler = {
        return .disabled
      }
      completionHandler(nil)
      activateExpectation.fulfill()
    }
    
    mockENManager.invalidateHandler = {
      invalidateExpectation.fulfill()
    }
    
    mockENManager.setExposureNotificationEnabledHandler = { enabled, completionHandler in
      if enabled {
        setExposureNotificationEnabledTrueExpectation.fulfill()
      }
      completionHandler(nil)
    }
    
    _ = ExposureManager(exposureNotificationManager: mockENManager,
                        notificationCenter: notificationCenterMock)
    wait(for: [activateExpectation,
               invalidateExpectation,
               registerNotificationExpectation,
               setExposureNotificationEnabledTrueExpectation], timeout: 1)
  }

  // When `awake` is called
  // an `onEnabledStatusUpdated` notification is posted
  func testAwake() {
    
    let broadcastAuthorizationStateExpectation = self.expectation(description: "A notification is post with the current authorization and enabled stated")
    let notificationCenterMock = NotificationCenterMock()
    notificationCenterMock.postHandler = { notification in
      if notification.name == .AuthorizationStatusDidChange {
        broadcastAuthorizationStateExpectation.fulfill()
      }
    }
    let exposureManager = ExposureManager(notificationCenter: notificationCenterMock)
    exposureManager.awake()
    wait(for: [broadcastAuthorizationStateExpectation], timeout: 0)
  }

  // When calling `currentExposures` on an ExposureManager instance
  // the call returns a string that can be serialized into an array of Exposures
  func testCurrentExposures() {
    let enManagerMock = ENManagerMock()

    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      return GenericResult<String>.success(String.default) as AnyObject
    }
    
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.exposures.append(Exposure(id: "1",
                                          date: Date().posixRepresentation))
      return userState
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock,
                                          btSecureStorage: btSecureStorageMock)
    let currentExposuresString = exposureManager.currentExposures
    let currentExposures = try! JSONDecoder().decode(Array<Exposure>.self, from: currentExposuresString.data(using: .utf8) ?? Data())
    XCTAssertEqual(currentExposures.count, 1)
  }

  // When `requestExposureNotificationAuthorization` is called
  // the request is forwarded to the underlying manager
  // and if the underlying manager successfully enables exposure notifications
  // and an `onEnabledStatusUpdated` notification is posted
  func testEnableNotificationsSuccess() {
    let resolveExpectation = self.expectation(description: "resolve is called")
    let rejectExpectation = self.expectation(description: "reject is not called")
    let broadcastAuthorizationStateExpectation = self.expectation(description: "A notification is posted with the current authorization and enabled stated")
    rejectExpectation.isInverted = true
    let notificationCenterMock = NotificationCenterMock()

    notificationCenterMock.postHandler = { notification in
      if notification.name == .AuthorizationStatusDidChange {
        broadcastAuthorizationStateExpectation.fulfill()
      }
    }
    let mockENManager = ENManagerMock()
    mockENManager.setExposureNotificationEnabledHandler = { _, completion in
      resolveExpectation.fulfill()
      completion(nil)
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager,
                                          notificationCenter: notificationCenterMock)
    exposureManager.requestExposureNotificationAuthorization(resolve: { _ in }) { (_, _, _) in }
    wait(for: [resolveExpectation,
               rejectExpectation,
               broadcastAuthorizationStateExpectation], timeout: 0)
  }

  // When `requestExposureNotificationAuthorization` is called
  // the request is forwarded to the underlying manager
  // and if the underlying manager does not successfully enable exposure notifications
  // and an `onEnabledStatusUpdated` notification is posted
  func testEnableNotificationsError() {
    let resolveExpectation = self.expectation(description: "resolve is not called")
    let rejectExpectation = self.expectation(description: "reject is called")
    let broadcastAuthorizationStateExpectation = self.expectation(description: "A notification is post with the current authorization and enabled stated")
    broadcastAuthorizationStateExpectation.isInverted = true
    resolveExpectation.isInverted = true

    let mockENManager = ENManagerMock()
    mockENManager.setExposureNotificationEnabledHandler = { _, _ in
      rejectExpectation.fulfill()
    }
    let notificationCenterMock = NotificationCenterMock()
    notificationCenterMock.postHandler = { notification in
      if notification.name == .AuthorizationStatusDidChange {
        broadcastAuthorizationStateExpectation.fulfill()
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager,
                                          notificationCenter: notificationCenterMock)
    exposureManager.requestExposureNotificationAuthorization(resolve: { _ in }) { (_, _, _) in }
    wait(for: [resolveExpectation,
               rejectExpectation,
               broadcastAuthorizationStateExpectation], timeout: 0)
  }

  // When calling `notifyUserBlueToothOffIfNeeded`
  // when bluetooth has been disabled
  // a notification request is added with the appropriate title and body
  func testBluetoothNotificationOn() {
    let addNotificationRequestExpectation = self.expectation(description: "A notification request is added with the proper title and body")
    let removeNotificationsExpectation = self.expectation(description: "when is not authorized and bluetooth is not off we just remove all delivered notifications")

    let unUserNotificationCenterMock = UNUserNotificationCenterMock()
    unUserNotificationCenterMock.addHandler = { request, completionHandler in
      addNotificationRequestExpectation.fulfill()
      let content = request.content
      XCTAssertEqual(request.identifier, String.bluetoothNotificationIdentifier)
      XCTAssertEqual(content.title, String.bluetoothNotificationTitle.localized)
      XCTAssertEqual(content.body, String.bluetoothNotificationBody.localized)
      //we execute the callback with an error just to get more test coverage :)
      completionHandler?(GenericError.unknown)
    }
    
    let mockENManager = ENManagerMock()

    mockENManager.exposureNotificationStatusHandler = {
      return .bluetoothOff
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager,
                                          userNotificationCenter: unUserNotificationCenterMock)
    addNotificationRequestExpectation.isInverted = false
    removeNotificationsExpectation.isInverted = true
    exposureManager.notifyUserBlueToothOffIfNeeded()
    wait(for: [addNotificationRequestExpectation, removeNotificationsExpectation], timeout: 0)
  }

  // When calling `notifyUserBlueToothOffIfNeeded`
  // when exposureNotificationStatus is not `bluetoothOff`
  // notification is removed from UNUserNotificationCenter
  func testBluetoothNotificationOff() {
    let addNotificatiionRequestExpectation = self.expectation(description: "A notification request is added with the proper title and body")
    let removeNotificationsExpectation = self.expectation(description: "when is not authorized and bluetooth is not off we just remove all delivered notifications")
    
    let unUserNotificationCenterMock = UNUserNotificationCenterMock()
    unUserNotificationCenterMock.removeDeliveredNotificationsHandler = { identifiers in
      removeNotificationsExpectation.fulfill()
      XCTAssertEqual(identifiers[0], String.bluetoothNotificationIdentifier)
    }
    
    let mockENManager = ENManagerMock()
    mockENManager.exposureNotificationStatusHandler = {
      return .active
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager,
                                          userNotificationCenter: unUserNotificationCenterMock)
    addNotificatiionRequestExpectation.isInverted = true
    removeNotificationsExpectation.isInverted = false
    exposureManager.notifyUserBlueToothOffIfNeeded()
    wait(for: [addNotificatiionRequestExpectation, removeNotificationsExpectation], timeout: 0)
  }
  
  func testRegisterBackgroundTask() {
    let registerExpectation = self.expectation(description: "A background task with the given identifier is registered")
    let bgSchedulerMock = BGTaskSchedulerMock()
    bgSchedulerMock.registerHandler = { identifier, launchHanlder in
      registerExpectation.fulfill()
      return true
    }
    let exposureManager = ExposureManager(backgroundTaskScheduler: bgSchedulerMock)
    exposureManager.registerBackgroundTask()
    wait(for: [registerExpectation], timeout: 0)
  }
  
  func testSubmitBackgroundTask() {
    let mockEnManager = ENManagerMock()
    mockEnManager.exposureNotificationStatusHandler = {
      return .active
    }
    let submitExpectation = self.expectation(description: "A background task request is submitted")
    let bgSchedulerMock = BGTaskSchedulerMock()
    bgSchedulerMock.submitHandler = { taskRequest in
      submitExpectation.fulfill()
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockEnManager,
                                          backgroundTaskScheduler: bgSchedulerMock)
    exposureManager.scheduleBackgroundTaskIfNeeded()
    wait(for: [submitExpectation], timeout: 0)
  }

  // When the request to download the exposure configuration fails
  // the placeholder configuration is used
  func testGetExposureConfigurationV1FallbackToDefault() {
    let expectation = self.expectation(description: "it falls back to the placeholder exposure configuration")
    let exposureManager = defaultExposureManager(enAPIVersion: .v1, forceDownloadConfigurationError: true)
    do {
      let config = try await(exposureManager.getExposureConfigurationV1())
      XCTAssertEqual(config, ExposureConfigurationV1.placeholder)
      expectation.fulfill()
    } catch {
      XCTFail()
    }
    wait(for: [expectation], timeout: 5)
  }

  // When the request to download the exposure configuration fails
  // the placeholder configuration is used
  @available(iOS 13.7, *)
  func testGetExposureConfigurationV2FallbackToDefault() {

    let expectation = self.expectation(description: "it falls back to the placeholder exposure configuration")
    let exposureManager = defaultExposureManager(enAPIVersion: .v2, forceDownloadConfigurationError: true)
    do {
      let config = try await(exposureManager.getExposureConfigurationV2())
      XCTAssertEqual(config, DailySummariesConfiguration.placeholder)
      expectation.fulfill()
    } catch {
      XCTFail()
    }
    wait(for: [expectation], timeout: 5)

  }

  func testRecentExposures() {
    let withExposures = defaultStorage()
    XCTAssertEqual(withExposures.userState.recentExposures.count, 1)
  }

  func testAuthorizationStatus() {

    let mockENManager = ENManagerMock()
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager)

    mockENManager.exposureNotificationStatusHandler = {
      return .unknown
    }
    XCTAssertEqual(exposureManager.exposureNotificationStatus,
                   ExposureManager.ExposureNoticationStatus.unknown)
    mockENManager.exposureNotificationStatusHandler = {
      return .active
    }
    XCTAssertEqual(exposureManager.exposureNotificationStatus,
                   ExposureManager.ExposureNoticationStatus.active)
    mockENManager.exposureNotificationStatusHandler = {
      return .disabled
    }
    XCTAssertEqual(exposureManager.exposureNotificationStatus,
                   ExposureManager.ExposureNoticationStatus.disabled)
    mockENManager.exposureNotificationStatusHandler = {
      return .bluetoothOff
    }
    XCTAssertEqual(exposureManager.exposureNotificationStatus,
                   ExposureManager.ExposureNoticationStatus.bluetoothOff)
    mockENManager.exposureNotificationStatusHandler = {
      return .restricted
    }
    XCTAssertEqual(exposureManager.exposureNotificationStatus,
                   ExposureManager.ExposureNoticationStatus.restricted)
    mockENManager.exposureNotificationStatusHandler = {
      return .paused
    }
    XCTAssertEqual(exposureManager.exposureNotificationStatus,
                   ExposureManager.ExposureNoticationStatus.paused)
    mockENManager.exposureNotificationStatusHandler = {
      return .unauthorized
    }
    XCTAssertEqual(exposureManager.exposureNotificationStatus,
                   ExposureManager.ExposureNoticationStatus.unauthorized)
  }

  func testGetCurrentENPermissionsStatus() {
    let mockENManager = ENManagerMock()
    mockENManager.exposureNotificationStatusHandler = {
      return .active
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager)
    exposureManager.getCurrentENPermissionsStatus { status in
      XCTAssertEqual(status, ExposureManager.ExposureNoticationStatus.active.rawValue)
    }
  }

}
