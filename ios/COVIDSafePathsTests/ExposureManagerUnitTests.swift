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
    return halloween
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
  
  func downloadRequest<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<T.ResponseType>) -> Void) where T : APIRequest, T.ResponseType : DownloadableFile {
    completion(downloadRequestHander!(request, requestType) as! Result<T.ResponseType>)
  }
  
  func request<T>(_ request: T, requestType: RequestType, completion: @escaping GenericCompletion) where T : APIRequest, T.ResponseType == Void {
    
  }
  
  func request<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<JSONObject>) -> Void) where T : APIRequest, T.ResponseType == JSONObject {
  }
  
  func request<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<T.ResponseType>) -> Void) where T : APIRequest, T.ResponseType : Decodable {
    completion(requestHander(request, requestType) as! Result<T.ResponseType>)
  }
  
  func requestList<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<[T.ResponseType.Element]>) -> Void) where T : APIRequest, T.ResponseType : Collection, T.ResponseType.Element : Decodable {
    
  }
  
  func requestString<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<T.ResponseType>) -> Void) where T : APIRequest, T.ResponseType == String {
    completion(requestHander(request, requestType) as! Result<T.ResponseType>)
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
  var exposureNotificationEnabledHandler: (() -> Bool)?
  var exposureNotificationStatusHandler: (() -> ENStatus)?
  var authorizationStatusHandler: (() -> ENAuthorizationStatus)?
  var getDiagnosisKeysHandler: ((ENGetDiagnosisKeysHandler) -> ())?
  var enDetectExposuresHandler: ((_ configuration: ENExposureConfiguration, _ diagnosisKeyURLs: [URL], _ completionHandler: @escaping ENDetectExposuresHandler) -> Progress)?
  var getExposureInfoHandler: ((_ summary: ENExposureDetectionSummary, _ userExplanation: String, _ completionHandler: @escaping ENGetExposureInfoHandler) -> Progress)?
  var dispatchQueue: DispatchQueue = DispatchQueue.main
  
  var invalidationHandler: (() -> Void)?
  
  func authorizationStatus() -> ENAuthorizationStatus {
    return authorizationStatusHandler?() ?? .unknown
  }
  
  var exposureNotificationEnabled: Bool {
    return exposureNotificationEnabledHandler?() ?? false
  }
  
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

class ExposureManagerTests: XCTestCase {
  
  func testCreatesSharedInstance() {
    ExposureManager.createSharedInstance()
    XCTAssertNotNil(ExposureManager.shared)
  }
  
  func testLifecycle() {
    let mockENManager = ENManagerMock()
    let activateExpectation = self.expectation(description: "Activate gets called")
    let invalidateExpectation = self.expectation(description: "Invalidate gets called")
    
    let registerNotificationExpectation = self.expectation(description: "Registers for authorization changes")
    
    let setExposureNotificationEnabledTrueExpectation = self.expectation(description: "When activated, if authorized and disabled, request to enable exposure notifications")
    
    let notificationCenterMock = NotificationCenterMock()
    notificationCenterMock.addObserverHandler = { (_, _, name, _) in
      if name == Notification.Name.AuthorizationStatusDidChange {
        registerNotificationExpectation.fulfill()
      }
    }
    
    mockENManager.activateHandler = { completionHandler in
      mockENManager.authorizationStatusHandler = {
        return .authorized
      }
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
  
  func testEnabledtatus() {
    
    let mockENManager = ENManagerMock()
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager)
    
    mockENManager.exposureNotificationEnabledHandler = {
      return true
    }
    XCTAssertEqual(exposureManager.enabledState, ExposureManager.EnabledState.enabled)
    mockENManager.exposureNotificationEnabledHandler = {
      return false
    }
    XCTAssertEqual(exposureManager.enabledState, ExposureManager.EnabledState.disabled)
  }
  
  func testAuthorizationStatus() {
    
    let mockENManager = ENManagerMock()
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager)
    
    mockENManager.authorizationStatusHandler = {
      return .authorized
    }
    XCTAssertEqual(exposureManager.authorizationState,
                   ExposureManager.AuthorizationState.authorized)
    mockENManager.authorizationStatusHandler = {
      return .notAuthorized
    }
    XCTAssertEqual(exposureManager.authorizationState,
                   ExposureManager.AuthorizationState.unauthorized)
    mockENManager.authorizationStatusHandler = {
      return .restricted
    }
    XCTAssertEqual(exposureManager.authorizationState,
                   ExposureManager.AuthorizationState.unauthorized)
    mockENManager.authorizationStatusHandler = {
      return .unknown
    }
    XCTAssertEqual(exposureManager.authorizationState,
                   ExposureManager.AuthorizationState.unauthorized)
  }
  
  func testBluetoothStatus() {
    
    let mockENManager = ENManagerMock()
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager)
    
    mockENManager.exposureNotificationStatusHandler = {
      return .bluetoothOff
    }
    XCTAssertFalse(exposureManager.isBluetoothEnabled)
    mockENManager.exposureNotificationStatusHandler = {
      return .active
    }
    XCTAssertTrue(exposureManager.isBluetoothEnabled)
    mockENManager.exposureNotificationStatusHandler = {
      return .disabled
    }
    XCTAssertTrue(exposureManager.isBluetoothEnabled)
    mockENManager.exposureNotificationStatusHandler = {
      return .paused
    }
    XCTAssertTrue(exposureManager.isBluetoothEnabled)
    mockENManager.exposureNotificationStatusHandler = {
      return .restricted
    }
    XCTAssertTrue(exposureManager.isBluetoothEnabled)
    mockENManager.exposureNotificationStatusHandler = {
      return .unknown
    }
    XCTAssertTrue(exposureManager.isBluetoothEnabled)
  }
  
  func testCurrentExposures() {
    let enManagerMock = ENManagerMock()
    
    enManagerMock.enDetectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
      let enExposureSummary = MockENExposureDetectionSummary()
      enExposureSummary.matchedKeyCountHandler = {
        return 1
      }
      enExposureSummary.attenuationDurationsHandler = {
        return [900,0,0]
      }
      completionHandler(enExposureSummary, nil)
      return Progress()
    }
    
    enManagerMock.detectExposuresHandler = { configuration, completion in
      completion(nil, GenericError.unknown)
      return Progress()
    }
    
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      return Result<String>.success(String.default) as AnyObject
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      if #available(iOS 13.7, *) {
        return Result<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder) as AnyObject
      }
      return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder) as AnyObject
    }
    
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.exposures.append(Exposure(id: "1",
                                          date: 0))
      return userState
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock,
                                          btSecureStorage: btSecureStorageMock)
    let currentExposures = exposureManager.currentExposures
    XCTAssertNoThrow(try! JSONDecoder().decode(Array<Exposure>.self, from: currentExposures.data(using: .utf8) ?? Data()))
  }
  
  func testEnableNotificationsSuccess() {
    let setEnabled = true
    let setExposureNotificationEnabledExpectation = self.expectation(description: "Request the change of state to the underlying manager")
    let mockENManager = ENManagerMock()
    mockENManager.setExposureNotificationEnabledHandler = { enabled, completionHandler in
      if enabled == setEnabled {
        setExposureNotificationEnabledExpectation.fulfill()
      }
      completionHandler(nil)
    }
    let broadcastAuthorizationStateExpectation = self.expectation(description: "A notification is post with the current authorization and enabled stated")
    let notificationCenterMock = NotificationCenterMock()
    notificationCenterMock.postHandler = { notification in
      if notification.name == .AuthorizationStatusDidChange {
        broadcastAuthorizationStateExpectation.fulfill()
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager,
                                          notificationCenter: notificationCenterMock)
    exposureManager.requestExposureNotificationAuthorization(enabled: setEnabled) { (error) in
      XCTAssertNil(error, "There should be no error")
    }
    wait(for: [setExposureNotificationEnabledExpectation,
               broadcastAuthorizationStateExpectation], timeout: 0)
  }
  
  func testEnableNotificationsError() {
    let setExposureNotificationEnabledExpectation = self.expectation(description: "Request the change of state to the underlying manager")
    let mockENManager = ENManagerMock()
    mockENManager.setExposureNotificationEnabledHandler = { enabled, completionHandler in
      setExposureNotificationEnabledExpectation.fulfill()
      completionHandler(ENError(ENError.Code.unknown))
    }
    let broadcastAuthorizationStateExpectation = self.expectation(description: "A notification is post with the current authorization and enabled stated")
    broadcastAuthorizationStateExpectation.isInverted = true
    let notificationCenterMock = NotificationCenterMock()
    notificationCenterMock.postHandler = { notification in
      if notification.name == .AuthorizationStatusDidChange {
        broadcastAuthorizationStateExpectation.fulfill()
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager,
                                          notificationCenter: notificationCenterMock)
    exposureManager.requestExposureNotificationAuthorization(enabled: false) { (error) in
      XCTAssertNotNil(error, "There should be an error")
    }
    wait(for: [setExposureNotificationEnabledExpectation,
               broadcastAuthorizationStateExpectation], timeout: 0)
  }
  
  func testGetCurrentENPermissionsStatus() {
    let mockENManager = ENManagerMock()
    mockENManager.authorizationStatusHandler = {
      return .authorized
    }
    mockENManager.exposureNotificationEnabledHandler = {
      return true
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager)
    exposureManager.getCurrentENPermissionsStatus { (authorized, enabled) in
      XCTAssertEqual(authorized, ExposureManager.AuthorizationState.authorized.rawValue)
      XCTAssertEqual(enabled, ExposureManager.EnabledState.enabled.rawValue)
    }
  }
  
  func testBluetoothNotificationOn() {
    let addNotificatiionRequestExpectation = self.expectation(description: "A notification request is added with the proper title and body")
    let removeNotificationsExpectation = self.expectation(description: "when is not authorized and bluetooth is not off we just remove all delivered notifications")
    
    let unUserNotificationCenterMock = UNUserNotificationCenterMock()
    unUserNotificationCenterMock.addHandler = { request, completionHandler in
      addNotificatiionRequestExpectation.fulfill()
      let content = request.content
      XCTAssertEqual(request.identifier, String.bluetoothNotificationIdentifier)
      XCTAssertEqual(content.title, String.bluetoothNotificationTitle.localized)
      XCTAssertEqual(content.body, String.bluetoothNotificationBody.localized)
      //we execute the callback with an error just to get more test coverage :)
      completionHandler?(GenericError.unknown)
    }
    
    let mockENManager = ENManagerMock()
    mockENManager.authorizationStatusHandler = {
      return .authorized
    }
    mockENManager.exposureNotificationStatusHandler = {
      return .bluetoothOff
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager,
                                          userNotificationCenter: unUserNotificationCenterMock)
    addNotificatiionRequestExpectation.isInverted = false
    removeNotificationsExpectation.isInverted = true
    exposureManager.notifyUserBlueToothOffIfNeeded()
    wait(for: [addNotificatiionRequestExpectation, removeNotificationsExpectation], timeout: 0)
  }
  
  func testRecentExposures() {
    let withExposures = defaultStorage()
    XCTAssertEqual(withExposures.userState.recentExposures.count, 1)
  }
  
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
  
  func testFetchExposureKeysSuccess() {
    let expectation = self.expectation(description: "a call is made to get the diagnosis keys")
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    exposureManager.fetchExposureKeys { (keys, error) in
      XCTAssertNil(error)
      XCTAssertEqual(keys?.count, 1)
      expectation.fulfill()
    }
    wait(for: [expectation], timeout: 0)
  }
  
  func testFetchExposureKeysError() {
    let expectation = self.expectation(description: "a call is made to get the diagnosis keys")
    let exposureManager = defaultExposureManager(withKeys: false, enAPIVersion: .v1)
    exposureManager.fetchExposureKeys { (keys, error) in
      XCTAssertEqual(error?.errorCode, ExposureManagerErrorCode.noExposureKeysFound.rawValue)
      XCTAssertNotNil(error?.underlyingError)
      expectation.fulfill()
    }
    wait(for: [expectation], timeout: 0)
  }
  
  func testFetchLastDetectionDate() {
    let userState = UserState()
    let exposureManager = defaultExposureManager(enAPIVersion: .v1, userState: userState)
    
    // Last detection date should initially be nil
    exposureManager.fetchLastDetectionDate { (posixDate, error) in
      XCTAssertNil(posixDate)
      XCTAssertEqual(error?.errorCode, ExposureManagerErrorCode.detectionNeverPerformed.rawValue)
    }
    
    let date = Date()
    userState.lastExposureCheckDate = date
    exposureManager.fetchLastDetectionDate { (posixDate, error) in
      XCTAssertNil(error)
      XCTAssertEqual(posixDate, NSNumber(value: date.posixRepresentation))
    }
  }
  
  func testRemainingFileCapacityReset() {
    let expectation = self.expectation(description: "remainingFileCapacity is updated")
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .success:
        XCTAssertEqual(exposureManager.btSecureStorage.remainingDailyFileProcessingCapacity, 14)
        expectation.fulfill()
      default: XCTFail()
      }
    }
    wait(for: [expectation], timeout: 5)
  }
  
  func testUpdateLastExposureDetectionDateV1() {
    let expectation = self.expectation(description: "lastExposureCheckDate is updated")
    
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    
    XCTAssertNil(exposureManager.btSecureStorage.lastExposureCheckDate)
    exposureManager.detectExposuresV1 { _ in
      XCTAssertNotNil(exposureManager.btSecureStorage.lastExposureCheckDate)
      expectation.fulfill()
    }
    wait(for: [expectation], timeout: 50)
  }
  
  func testRemainingFileCapacityNoResetForDetectionError() {
    let expectation = self.expectation(description: "remainingFileCapacity is not updated")
    
    let exposureManager = defaultExposureManager(enAPIVersion: .v1,
                                                 forceExposureDetectionError: true)
    
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure:
        XCTAssertEqual(exposureManager.btSecureStorage.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
        expectation.fulfill()
      default: XCTFail()
      }
    }
    wait(for: [expectation], timeout: 5)
  }
  
  func testDebugFetchDiagnosisKeys() {
    let debugAction = DebugAction.fetchDiagnosisKeys
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    let successExpetactionResolve = self.expectation(description: "resolve is called")
    let successExpectationReject = self.expectation(description: "reject is not called")
    successExpectationReject.isInverted = true
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      successExpetactionResolve.fulfill()
    }) { (_, _, _) in
      successExpectationReject.fulfill()
    }
    wait(for: [successExpetactionResolve, successExpectationReject], timeout: 0)
  }
  
  func testDebugSimulateExposureDetectionError() {
    let debugAction = DebugAction.simulateExposureDetectionError
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    let successExpectactionResolve = self.expectation(description: "resolve is called")
    let successExpectationReject = self.expectation(description: "reject is not called")
    successExpectationReject.isInverted = true
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      successExpectactionResolve.fulfill()
    }) { (_, _, _) in
      successExpectationReject.fulfill()
    }
    wait(for: [successExpectactionResolve, successExpectationReject], timeout: 0)
  }
  
  func testDebugSimulateExposure() {
    let debugAction = DebugAction.simulateExposure
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    let successExpectactionResolve = self.expectation(description: "resolve is called")
    let successExpectationReject = self.expectation(description: "reject is not called")
    successExpectationReject.isInverted = true
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      successExpectactionResolve.fulfill()
    }) { (_, _, _) in
      successExpectationReject.fulfill()
    }
    wait(for: [successExpectactionResolve, successExpectationReject], timeout: 0)
  }
  
  func testDebugFetchExposures() {
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    let debugAction = DebugAction.fetchExposures
    let successExpetactionResolve = self.expectation(description: "resolve is called")
    let successExpectationReject = self.expectation(description: "reject is not called")
    successExpectationReject.isInverted = true
    
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      successExpetactionResolve.fulfill()
    }) { (_, _, _) in
      successExpectationReject.fulfill()
    }
    wait(for: [successExpetactionResolve, successExpectationReject], timeout: 2)
  }
  
  func testDebugResetExposures() {
    let debugAction = DebugAction.resetExposures
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    let successExpetactionResolve = self.expectation(description: "resolve is called")
    let successExpectationReject = self.expectation(description: "reject is not called")
    successExpectationReject.isInverted = true
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      successExpetactionResolve.fulfill()
    }) { (_, _, _) in
      successExpectationReject.fulfill()
    }
    wait(for: [successExpetactionResolve, successExpectationReject], timeout: 0)
  }
  
  func testDebugToggleENAuthorization() {
    let debugAction = DebugAction.toggleENAuthorization
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    let successExpetactionResolve = self.expectation(description: "resolve is called")
    let successExpectationReject = self.expectation(description: "reject is not called")
    successExpectationReject.isInverted = true
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      successExpetactionResolve.fulfill()
    }) { (_, _, _) in
      successExpectationReject.fulfill()
    }
    wait(for: [successExpetactionResolve, successExpectationReject], timeout: 0)
  }
  
  func testDebugShowLastProcessedFilePath() {
    let debugAction = DebugAction.showLastProcessedFilePath
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    let successExpetactionResolve = self.expectation(description: "resolve is called")
    let successExpectationReject = self.expectation(description: "reject is not called")
    successExpectationReject.isInverted = true
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      successExpetactionResolve.fulfill()
    }) { (_, _, _) in
      successExpectationReject.fulfill()
    }
    wait(for: [successExpetactionResolve, successExpectationReject], timeout: 0)
  }
  
  func testDetectExposuresKeysDownloadingError() {
    let expectation = self.expectation(description: "the exposure detection call returns an error")
    let exposureManager = defaultExposureManager(enAPIVersion: .v1,
                                                 forceDownloadKeyError: true)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
        expectation.fulfill()
      default: XCTFail()
      }
    }
    wait(for: [expectation], timeout: 5)
  }
  
  func testDetectExposuresUnpackagingError() {
    let expectation = self.expectation(description: "the exposure detection call returns an error")
    let exposureManager = defaultExposureManager(enAPIVersion: .v1,
                                                 forceKeyUnpackingError: true)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
        expectation.fulfill()
      default: XCTFail()
      }
    }
    
    wait(for: [expectation], timeout: 5)
  }
  
  func testDetectExposuresGetExposureInfoError() {
    let expectation = self.expectation(description: "the exposure detection call returns an error")
    let exposureManager = defaultExposureManager(enAPIVersion: .v1, forceGetExposureInfoError: true)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
        expectation.fulfill()
      default: XCTFail()
      }
    }
    wait(for: [expectation], timeout: 5)
  }
  
  func testExposureSummaryScoringMatchedKey0() {
    let enExposureSummary = MockENExposureDetectionSummary()
    enExposureSummary.matchedKeyCountHandler = {
      return 0
    }
    XCTAssertFalse(enExposureSummary.isAboveScoreThreshold(with: ExposureConfigurationV1.placeholder))
  }
  
  func testExposureSummaryScoringMatchedKey1() {
    let enExposureSummary = MockENExposureDetectionSummary()
    enExposureSummary.matchedKeyCountHandler = {
      return 1
    }
    enExposureSummary.attenuationDurationsHandler = {
      return [900,0,0]
    }
    let configuration = ExposureConfigurationV1.placeholder
    XCTAssertTrue(enExposureSummary.isAboveScoreThreshold(with: configuration))
    enExposureSummary.attenuationDurationsHandler = {
      return [800,0,0]
    }
    XCTAssertFalse(enExposureSummary.isAboveScoreThreshold(with: configuration))
    enExposureSummary.attenuationDurationsHandler = {
      return [0,900,0]
    }
    XCTAssertFalse(enExposureSummary.isAboveScoreThreshold(with: configuration))
    enExposureSummary.attenuationDurationsHandler = {
      return [600,600,0]
    }
    XCTAssertTrue(enExposureSummary.isAboveScoreThreshold(with: configuration))
    enExposureSummary.attenuationDurationsHandler = {
      return [0,0,1800]
    }
    XCTAssertFalse(enExposureSummary.isAboveScoreThreshold(with: configuration))
  }
  
  func testExposureSummaryScoringMatchedKey3() {
    let enExposureSummary = MockENExposureDetectionSummary()
    enExposureSummary.matchedKeyCountHandler = {
      return 3
    }
    enExposureSummary.attenuationDurationsHandler = {
      return [900,1800,0]
    }
    let configuration = ExposureConfigurationV1.placeholder
    XCTAssertFalse(enExposureSummary.isAboveScoreThreshold(with: configuration))
    enExposureSummary.attenuationDurationsHandler = {
      return [1800,1800,0]
    }
    XCTAssertTrue(enExposureSummary.isAboveScoreThreshold(with: configuration))
  }
  
  func testExposureSummaryScoringMatchedKey4() {
    let enExposureSummary = MockENExposureDetectionSummary()
    enExposureSummary.matchedKeyCountHandler = {
      return 4
    }
    enExposureSummary.attenuationDurationsHandler = {
      return [900,1800,0]
    }
    let configuration = ExposureConfigurationV1.placeholder
    XCTAssertFalse(enExposureSummary.isAboveScoreThreshold(with: configuration))
    enExposureSummary.attenuationDurationsHandler = {
      return [1800,1800,0]
    }
    XCTAssertTrue(enExposureSummary.isAboveScoreThreshold(with: configuration))
  }
  
  func testDetectExposuresSuccessScoreBelow() {
    let storeExposureExpectation = self.expectation(description: "The exposure does not get stored")
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
        storeExposureExpectation.fulfill()
      default: XCTFail()
      }
    }
    wait(for: [storeExposureExpectation], timeout:1)
  }
  
  func testDetectExposuresSuccessScoreAbove() {
    let expectation = self.expectation(description: "1 exposure is detected")
    let exposureManager = defaultExposureManager(enAPIVersion: .v1)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
        expectation.fulfill()
      default: XCTFail()
      }
    }
    wait(for: [expectation], timeout: 5)
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
    mockEnManager.authorizationStatusHandler = {
      return .authorized
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
  
  // MARK: == DETECTION EXPOSURE V2 TESTS ==
  
  @available(iOS 13.7, *)
  func testDetectExposuresV2AggregateDetectError() {
    let expectation = self.expectation(description: "the exposure detection call returns an error")
    let exposureManager = defaultExposureManager(enAPIVersion: .v2,
                                                 forceExposureDetectionError: true)
    exposureManager.detectExposuresV2 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
        expectation.fulfill()
      default: XCTFail()
      }
    }
    wait(for: [expectation], timeout: 5)
  }
  
  @available(iOS 13.7, *)
  func testUpdateLastExposureDetectionDateV2() {
    let expectation = self.expectation(description: "lastExposureCheckDate is updated")
    
    let exposureManager = defaultExposureManager(enAPIVersion: .v2)
    
    XCTAssertNil(exposureManager.btSecureStorage.lastExposureCheckDate)
    
    exposureManager.detectExposuresV2 { _ in
      XCTAssertNotNil(exposureManager.btSecureStorage.lastExposureCheckDate)
      expectation.fulfill()
    }
    wait(for: [expectation], timeout: 5)
  }
  
  @available(iOS 13.7, *)
  func testDetectExposuresSuccessPreexistingSavedExposureForDate() {
    let storeExposureExpectation = self.expectation(description: "The exposure does not get stored")
    
    let userState = UserState()
    userState.exposures.append(Exposure(id: "3",
                                        date: halloween.posixRepresentation))
    
    let exposureManager = defaultExposureManager(enAPIVersion: .v2, userState: userState)
    
    (exposureManager.btSecureStorage as! BTSecureStorageMock).storeExposuresHandler = { exposures in
      XCTAssertEqual(exposures.count, 0)
      storeExposureExpectation.fulfill()
    }
    
    exposureManager.detectExposuresV2 { _ in }
    
    wait(for: [storeExposureExpectation], timeout: 5)
  }
  
  @available(iOS 13.7, *)
  func testDetectExposuresSuccessNoPreexistingSavedExposureForDate() {
    let storeExposureExpectation = self.expectation(description: "The exposure is stored")
    let userState = UserState()
    userState.exposures.append(Exposure(id: "3",
                                        date: Date().posixRepresentation))
    
    let exposureManager = defaultExposureManager(enAPIVersion: .v2, userState: userState)
    (exposureManager.btSecureStorage as! BTSecureStorageMock).storeExposuresHandler = { exposures in
      XCTAssertEqual(exposures.count, 1)
      storeExposureExpectation.fulfill()
    }
    
    exposureManager.detectExposuresV2 { _ in }
    
    wait(for: [storeExposureExpectation], timeout: 5)
  }
  
  @available(iOS 13.7, *)
  func testValidDailySummariesConfiguration() {
    let dict: [String: Any] = ["DailySummariesConfig": ["attenuationDurationThresholds": [40,53,60],
                                                        "attenuationBucketWeights": [1,1,0.5,0],
                                                        "reportTypeWeights": [1,0,0,0],
                                                        "reportTypeWhenMissing": 1,
                                                        "infectiousnessWeights": [1,1],
                                                        "infectiousnessWhenDaysSinceOnsetMissing": 1,
                                                        "daysSinceOnsetToInfectiousness": [[-2,1],
                                                                                           [-1,1],
                                                                                           [0,1],
                                                                                           [1,1],
                                                                                           [2,1],
                                                                                           [3,1],
                                                                                           [4,1],
                                                                                           [5,1],
                                                                                           [6,1],
                                                                                           [7,1],
                                                                                           [8,1],
                                                                                           [9,1],
                                                                                           [10,1],
                                                                                           [11,1],
                                                                                           [12,1],
                                                                                           [13,1],
                                                                                           [14,1]]],
                               "triggerThresholdWeightedDuration": 15]
    let jsonData = try! JSONSerialization.data(withJSONObject: dict)
    let config = DailySummariesConfiguration.create(from: jsonData)!
    XCTAssertEqual(config.daysSinceOnsetToInfectiousness[NSNumber(value: ENDaysSinceOnsetOfSymptomsUnknown)], 1)
  }
  
  @available(iOS 13.7, *)
  func testDetectExposuresV2SuccessScoreBelow() {
    let storeExposureExpectation = self.expectation(description: "The exposure does not gets stored")
    let exposureManager = defaultExposureManager(enAPIVersion: .v2,
                                                 forceRiskScore: .belowThreshold)
    exposureManager.detectExposuresV2 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
        storeExposureExpectation.fulfill()
      default: XCTFail()
      }
    }
    wait(for: [storeExposureExpectation], timeout: 5)
  }
  
  @available(iOS 13.7, *)
  func testDetectExposuresV2SuccessScoreAbove() {
    let storeExposureExpectation = self.expectation(description: "The exposure gets stored")
    let exposureManager = defaultExposureManager(enAPIVersion: .v2,
                                                 forceRiskScore: .aboveThreshold)
    exposureManager.detectExposuresV2 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
        storeExposureExpectation.fulfill()
      default: XCTFail()
      }
    }
    wait(for: [storeExposureExpectation], timeout: 5)
  }
  
  @available(iOS 13.7, *)
  func testGetExposureConfigurationV2FallbackToDefault() {
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      return Result<String>.success("indexFilePath") as AnyObject
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      return Result<DailySummariesConfiguration>.failure(GenericError.unknown)
    }
    let exposureManager = defaultExposureManager(enAPIVersion: .v2,
                                                 forceDownloadConfigurationError: true)
    do {
      let config = try await(exposureManager.getExposureConfigurationV2())
      XCTAssertEqual(config, DailySummariesConfiguration.placeholder)
    } catch {
      XCTFail()
    }
  }
}

var halloween: Date {
  var components = DateComponents()
  components.year = 2019
  components.month = 10
  components.day = 31
  let date = Calendar.current.date(from: components)
  return date!
}

var startOfDay: Date {
  return Calendar.current.startOfDay(for: Date())
}

