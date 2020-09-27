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
  var detectAggregateExposuresHandler: ((_ configuration: ENExposureConfiguration,
                                         _ completionHandler: @escaping ENDetectExposuresHandler) -> Progress)?

  func detectExposures(configuration: ENExposureConfiguration, completionHandler: @escaping ENDetectExposuresHandler) -> Progress {
    return detectAggregateExposuresHandler?(configuration, completionHandler) ?? Progress()
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
  var detectExposuresHandler: ((_ configuration: ENExposureConfiguration, _ diagnosisKeyURLs: [URL], _ completionHandler: @escaping ENDetectExposuresHandler) -> Progress)?
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
    return detectExposuresHandler?(configuration, diagnosisKeyURLs, completionHandler) ?? Progress()
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

    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
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

    enManagerMock.detectAggregateExposuresHandler = { configuration, completion in
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
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.exposures.append(Exposure(id: "1",
                                          date: halloween.posixRepresentation))
      userState.exposures.append(Exposure(id: "2",
                                          date: Date().posixRepresentation))
      return userState
    }
    XCTAssertEqual(btSecureStorageMock.userState.recentExposures.count, 1)
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

  func testFetchExposureKeys() {
    let mockENManager = ENManagerMock()
    let expectation = self.expectation(description: "a call is made to get the diagnosis keys")
    mockENManager.getDiagnosisKeysHandler = { callback in
      expectation.fulfill()
      callback([ENTemporaryExposureKey()], nil)
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager)
    exposureManager.fetchExposureKeys { (keys, error) in
      XCTAssertNil(error)
      XCTAssertEqual(keys?.count, 1)
    }
    wait(for: [expectation], timeout: 0)
    mockENManager.getDiagnosisKeysHandler = { callback in
      callback(nil, GenericError.unknown)
    }
    exposureManager.fetchExposureKeys { (keys, error) in
      XCTAssertEqual(error?.errorCode, ExposureManagerErrorCode.noExposureKeysFound.rawValue)
      XCTAssertNotNil(error?.underlyingError)
    }
  }

  func testFetchLastDetectionDate() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter.default)
    let userState = UserState()
    btSecureStorageMock.userStateHandler = {
      return userState
    }
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
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
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.remainingDailyFileProcessingCapacity = 0
      return userState
    }
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .success:
        XCTAssertEqual(btSecureStorageMock.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
      default: XCTFail()
      }
    }
  }

  func testRemainingFileCapacityNoResetForDetectionError() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.remainingDailyFileProcessingCapacity = 0
      return userState
    }
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    exposureManager.detectExposuresV1 { (result) in
      //no op
    }
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure:
        XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity, 0)
      default: XCTFail()
      }
    }
  }

  func testDebugFetchDiagnosisKeys() {
    let debugAction = DebugAction.fetchDiagnosisKeys
    let enManagerMock = ENManagerMock()
    enManagerMock.getDiagnosisKeysHandler = { callback in
      callback([ENTemporaryExposureKey()], nil)
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock)
    let successExpetactionResolve = self.expectation(description: "resolve is called")
    let successExpectationReject = self.expectation(description: "reject is not called")
    successExpectationReject.isInverted = true
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      successExpetactionResolve.fulfill()
    }) { (_, _, _) in
      successExpectationReject.fulfill()
    }
    wait(for: [successExpetactionResolve, successExpectationReject], timeout: 0)
    
    let failExpectationResolve = self.expectation(description: "resolve is not called")
    failExpectationResolve.isInverted = true
    let failExpectationReject = self.expectation(description: "reject is called")
    enManagerMock.getDiagnosisKeysHandler = { callback in
      callback(nil, ExposureManagerError(errorCode: ExposureManagerErrorCode.noExposureKeysFound,
                                         localizedMessage: "Message"))
    }
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      failExpectationResolve.fulfill()
    }) { (_, _, _) in
      failExpectationReject.fulfill()
    }
    wait(for: [failExpectationResolve, failExpectationReject], timeout: 0)
  }

  func testDebugDetectExposuresNow() {
    let debugAction = DebugAction.detectExposuresNow
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.remainingDailyFileProcessingCapacity = 0
      return userState
    }
    var exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)

    let failureExpectactionResolve = self.expectation(description: "resolve is not called")
    let failureExpectationReject = self.expectation(description: "reject is  called")
    failureExpectactionResolve.isInverted = true
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      failureExpectactionResolve.fulfill()
    }) { (_, _, _) in
      failureExpectationReject.fulfill()
    }
    wait(for: [failureExpectactionResolve, failureExpectationReject], timeout: 0)

    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      XCTAssertEqual(requestType, RequestType.downloadKeys)
      return Result<String>.failure(GenericError.unknown) as AnyObject
    }
    let failExpectationResolve = self.expectation(description: "resolve is not called")
    failExpectationResolve.isInverted = true
    let failExpectationReject = self.expectation(description: "reject is called")
    exposureManager = ExposureManager(apiClient: apiClientMock, btSecureStorage: btSecureStorageMock)
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      failExpectationResolve.fulfill()
    }) { (_, _, _) in
      failExpectationReject.fulfill()
    }
    wait(for: [failExpectationResolve, failExpectationReject], timeout: 0)
  }

  func testDebugSimulateExposureDetectionError() {
    let debugAction = DebugAction.simulateExposureDetectionError
    let enManagerMock = ENManagerMock()
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock)
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
    let enManagerMock = ENManagerMock()
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock)
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
    let enManagerMock = ENManagerMock()

    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
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

    enManagerMock.detectAggregateExposuresHandler = { configuration, completion in
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

    let debugAction = DebugAction.fetchExposures
    let successExpetactionResolve = self.expectation(description: "resolve is called")
    let successExpectationReject = self.expectation(description: "reject is not called")
    successExpectationReject.isInverted = true
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
    exposureManager.handleDebugAction(debugAction, resolve: { (success) in
      successExpetactionResolve.fulfill()
    }) { (_, _, _) in
      successExpectationReject.fulfill()
    }
    wait(for: [successExpetactionResolve, successExpectationReject], timeout: 2)
  }

  func testDebugResetExposures() {
    let debugAction = DebugAction.resetExposures
    let enManagerMock = ENManagerMock()
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock)
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
    let enManagerMock = ENManagerMock()
    enManagerMock.setExposureNotificationEnabledHandler = { enabled, completionHandler in
      completionHandler(nil)
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock)
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
    let enManagerMock = ENManagerMock()
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock)
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

  func testDetectExposuresDisalowConcurrentExposures() {
    let exposureManager = ExposureManager()
    exposureManager.detectExposuresV1 { (result) in
      //no op
    }
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertNotNil(error)
      default: XCTFail()
      }
    }
  }

  func testDetectExposuresLimitCap() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.remainingDailyFileProcessingCapacity = 0
      return userState
    }
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .success(let newCases):
        XCTAssertEqual(newCases, 0)
      default: XCTFail()
      }
    }
  }

  func testDetectExposuresKeysDownloadingError() {
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      XCTAssertEqual(requestType, RequestType.downloadKeys)
      return Result<String>.failure(GenericError.unknown) as AnyObject
    }
    let exposureManager = ExposureManager(apiClient: apiClientMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
      default: XCTFail()
      }
    }
  }

  func testDetectExposuresFailsDownloadingKeysError() {
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      XCTAssertEqual(requestType, RequestType.downloadKeys)
      return Result<String>.success("indexFilePath\nanotherFilePath") as AnyObject
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
      XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
      XCTAssertEqual(requestType, RequestType.downloadKeys)
      return Result<DownloadedPackage>.failure(GenericError.unknown)
    }
    let exposureManager = ExposureManager(apiClient: apiClientMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
      default: XCTFail()
      }
    }
  }

  func testDetectExposuresUnpackagingError() {
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      XCTAssertEqual(requestType, RequestType.downloadKeys)
      return Result<String>.success("indexFilePath\nanotherFilePath") as AnyObject
    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      throw GenericError.unknown
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
      XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
      XCTAssertEqual(requestType, RequestType.downloadKeys)

      return Result<DownloadedPackage>.success(mockDownloadedPackage)
    }
    let exposureManager = ExposureManager(apiClient: apiClientMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
      default: XCTFail()
      }
    }
  }
  
  func testDetectExposuresDetectExposureError() {
    let enManagerMock = ENManagerMock()
    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
      completionHandler(nil, GenericError.unknown)
      return Progress()
    }
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      return Result<String>.success("indexFilePath") as AnyObject
    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
        XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
        XCTAssertEqual(requestType, RequestType.downloadKeys)
        return Result<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder)
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
      default: XCTFail()
      }
    }
  }

  func testDetectExposuresGetExposureInfoError() {
    let enManagerMock = ENManagerMock()
    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
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
    enManagerMock.getExposureInfoHandler = { summary, explanation, completionHandler in
      completionHandler(nil, GenericError.unknown)
      return Progress()
    }
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      if requestType == RequestType.downloadKeys {
        return Result<String>.success("indexFilePath") as AnyObject
      }
      return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder) as AnyObject
    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
        XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
        XCTAssertEqual(requestType, RequestType.downloadKeys)
        return Result<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder)
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
      default: XCTFail()
      }
    }
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
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      return UserState()
    }
    btSecureStorageMock.storeExposuresHandler = { exposures in
      storeExposureExpectation.fulfill()
      XCTAssertEqual(exposures.count, 0)
    }
    let enManagerMock = ENManagerMock()
    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
      completionHandler(MockENExposureDetectionSummary(), nil)
      return Progress()
    }
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      if requestType == RequestType.downloadKeys {
        return Result<String>.success("indexFilePath") as AnyObject
      }
      return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder) as AnyObject

    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
        XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
        XCTAssertEqual(requestType, RequestType.downloadKeys)
        return Result<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder)
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock,
                                          btSecureStorage: btSecureStorageMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
      default: XCTFail()
      }
    }
    wait(for: [storeExposureExpectation], timeout:1)
  }

  func testDetectExposuresSuccessScoreAbove() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.storeExposuresHandler = { exposures in
      XCTAssertEqual(exposures.count, 1)
    }
    btSecureStorageMock.userStateHandler = {
      return UserState()
    }
    let enManagerMock = ENManagerMock()
    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
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
    enManagerMock.getExposureInfoHandler = { summary, useExplanation, completionHandler in
      completionHandler([MockENExposureInfo()], nil)
      return Progress()
    }
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      if requestType == RequestType.downloadKeys {
        return Result<String>.success("indexFilePath") as AnyObject
      }
      return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder) as AnyObject
    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
        XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
        XCTAssertEqual(requestType, RequestType.downloadKeys)
        return Result<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder)
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock,
                                          btSecureStorage: btSecureStorageMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
      default: XCTFail()
      }
    }
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
    let enManagerMock = ENManagerMock()
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      return Result<String>.success("indexFilePath") as AnyObject
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      return Result<ExposureConfigurationV1>.failure(GenericError.unknown)
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock)
    do {
      let config = try await(exposureManager.getExposureConfigurationV1())
      XCTAssertEqual(config, ExposureConfigurationV1.placeholder)
    } catch {
      XCTFail()
    }
  }

  // MARK: == DETECTION EXPOSURE V2 TESTS ==

  func testDetectExposuresV2AggregateDetectError() {
    let enManagerMock = ENManagerMock()
    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
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
    enManagerMock.detectAggregateExposuresHandler = { configuration, completion in
      completion(nil, GenericError.unknown)
      return Progress()
    }
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      if requestType == RequestType.downloadKeys {
        return Result<String>.success("indexFilePath") as AnyObject
      }
      return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder) as AnyObject
    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
        XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
        XCTAssertEqual(requestType, RequestType.downloadKeys)
        return Result<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return Result<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder)
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock)
    exposureManager.detectExposuresV1 { (result) in
      switch result {
      case .failure(let error):
        XCTAssertEqual(error.localizedDescription, GenericError.unknown.localizedDescription)
      default: XCTFail()
      }
    }
  }

  @available(iOS 13.7, *)
  func testUpdateLastExposureDetectionDateV2() {
    let expectation = self.expectation(description: "lastExposureCheckDate is updated")
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    XCTAssertNil(btSecureStorageMock.lastExposureCheckDate)
    exposureManager.detectExposuresV2 { _ in
      XCTAssertNotNil(btSecureStorageMock.lastExposureCheckDate)
      expectation.fulfill()
    }
    wait(for: [expectation], timeout:5)
  }

  func testUpdateLastExposureDetectionDateV1() {
    let expectation = self.expectation(description: "lastExposureCheckDate is updated")
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    XCTAssertNil(btSecureStorageMock.lastExposureCheckDate)
    exposureManager.detectExposuresV1 { _ in
      XCTAssertNotNil(btSecureStorageMock.lastExposureCheckDate)
      expectation.fulfill()
    }
    wait(for: [expectation], timeout:5)
  }

  @available(iOS 13.7, *)
  func testDetectExposuresSuccessPreexistingSavedExposureForDate() {
    let storeExposureExpectation = self.expectation(description: "The exposure does not get stored")
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.exposures.append(Exposure(id: "1",
                                          date: halloween.posixRepresentation))
      return userState
    }
    btSecureStorageMock.storeExposuresHandler = { exposures in
      storeExposureExpectation.fulfill()
      XCTAssertEqual(exposures.count, 0)
    }
    let enManagerMock = ENManagerMock()
    let mockDaySummariesENExposureDetectionSummary = MockDaySummariesENExposureDetectionSummary()
    let enExposureSummaryItemMock = MockENExposureSummaryItem()
    enExposureSummaryItemMock.weightedDurationSumHandler = {
      return 20
    }
    let enExposureDaySummaryMock = MockENExposureDaySummary()
    enExposureDaySummaryMock.daySummaryHandler = {
      return enExposureSummaryItemMock
    }
    mockDaySummariesENExposureDetectionSummary.daySummariesHandler = {
      return [enExposureDaySummaryMock]
    }

    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
      completionHandler(mockDaySummariesENExposureDetectionSummary, nil)
      return Progress()
    }
    enManagerMock.detectAggregateExposuresHandler = { configuration, completionHandler in
      completionHandler(mockDaySummariesENExposureDetectionSummary, nil)
      return Progress()
    }
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      if requestType == RequestType.downloadKeys {
        return Result<String>.success("indexFilePath") as AnyObject
      }
      return Result<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder) as AnyObject

    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
        XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
        XCTAssertEqual(requestType, RequestType.downloadKeys)
        return Result<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return Result<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder)
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock,
                                          btSecureStorage: btSecureStorageMock)
    exposureManager.detectExposuresV2 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
      default: XCTFail()
      }
    }
    wait(for: [storeExposureExpectation], timeout:2)
  }

  @available(iOS 13.7, *)
  func testDetectExposuresSuccessNoPreexistingSavedExposureForDate() {
    let date = Date().posixRepresentation
    let storeExposureExpectation = self.expectation(description: "The exposure is stored successfully")
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.exposures.append(Exposure(id: "1",
                                          date: date))
      return userState
    }
    btSecureStorageMock.storeExposuresHandler = { exposures in
      storeExposureExpectation.fulfill()
      XCTAssertEqual(exposures.count, 1)
    }
    let enManagerMock = ENManagerMock()
    let mockDaySummariesENExposureDetectionSummary = MockDaySummariesENExposureDetectionSummary()
    let enExposureSummaryItemMock = MockENExposureSummaryItem()
    enExposureSummaryItemMock.weightedDurationSumHandler = {
      return 20
    }
    let enExposureDaySummaryMock = MockENExposureDaySummary()
    enExposureDaySummaryMock.daySummaryHandler = {
      return enExposureSummaryItemMock
    }
    mockDaySummariesENExposureDetectionSummary.daySummariesHandler = {
      return [enExposureDaySummaryMock]
    }

    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
      completionHandler(mockDaySummariesENExposureDetectionSummary, nil)
      return Progress()
    }
    enManagerMock.detectAggregateExposuresHandler = { configuration, completionHandler in
      completionHandler(mockDaySummariesENExposureDetectionSummary, nil)
      return Progress()
    }
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      if requestType == RequestType.downloadKeys {
        return Result<String>.success("indexFilePath") as AnyObject
      }
      return Result<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder) as AnyObject

    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
        XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
        XCTAssertEqual(requestType, RequestType.downloadKeys)
        return Result<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return Result<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder)
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock,
                                          btSecureStorage: btSecureStorageMock)
    exposureManager.detectExposuresV2 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
      default: XCTFail()
      }
    }
    wait(for: [storeExposureExpectation], timeout:2)
  }


  @available(iOS 13.7, *)
  func testDetectExposuresV2SuccessScoreBelow() {
    let storeExposureExpectation = self.expectation(description: "The exposure does not gets stored")
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      return UserState()
    }
    btSecureStorageMock.storeExposuresHandler = { exposures in
      storeExposureExpectation.fulfill()
      XCTAssertEqual(exposures.count, 0)
    }
    let enManagerMock = ENManagerMock()
    let mockDaySummariesENExposureDetectionSummary = MockDaySummariesENExposureDetectionSummary()
    let enExposureDaySummaryMock = MockENExposureDaySummary()
    enExposureDaySummaryMock.daySummaryHandler = {
      return MockENExposureSummaryItem()
    }
    mockDaySummariesENExposureDetectionSummary.daySummariesHandler = {
      return [enExposureDaySummaryMock]
    }

    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
      completionHandler(mockDaySummariesENExposureDetectionSummary, nil)
      return Progress()
    }
    enManagerMock.detectAggregateExposuresHandler = { configuration, completionHandler in
      completionHandler(mockDaySummariesENExposureDetectionSummary, nil)
      return Progress()
    }
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      if requestType == RequestType.downloadKeys {
        return Result<String>.success("indexFilePath") as AnyObject
      }
      return Result<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder) as AnyObject

    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
        XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
        XCTAssertEqual(requestType, RequestType.downloadKeys)
        return Result<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return Result<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder)
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock,
                                          btSecureStorage: btSecureStorageMock)
    exposureManager.detectExposuresV2 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
      default: XCTFail()
      }
    }
    wait(for: [storeExposureExpectation], timeout:2)
  }

  @available(iOS 13.7, *)
  func testDetectExposuresV2SuccessScoreAbove() {
    let storeExposureExpectation = self.expectation(description: "The exposure gets stored")
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      return UserState()
    }
    btSecureStorageMock.storeExposuresHandler = { exposures in
      storeExposureExpectation.fulfill()
      XCTAssertEqual(exposures.count, 1)
    }
    let enManagerMock = ENManagerMock()
    let mockDaySummariesENExposureDetectionSummary = MockDaySummariesENExposureDetectionSummary()
    let enExposureSummaryItemMock = MockENExposureSummaryItem()
    enExposureSummaryItemMock.weightedDurationSumHandler = {
      return 20
    }
    let enExposureDaySummaryMock = MockENExposureDaySummary()
    enExposureDaySummaryMock.daySummaryHandler = {
      return enExposureSummaryItemMock
    }
    mockDaySummariesENExposureDetectionSummary.daySummariesHandler = {
      return [enExposureDaySummaryMock]
    }

    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
      completionHandler(mockDaySummariesENExposureDetectionSummary, nil)
      return Progress()
    }
    enManagerMock.detectAggregateExposuresHandler = { configuration, completionHandler in
      completionHandler(mockDaySummariesENExposureDetectionSummary, nil)
      return Progress()
    }
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      if requestType == RequestType.downloadKeys {
        return Result<String>.success("indexFilePath") as AnyObject
      }
      return Result<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder) as AnyObject

    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        let diagnosisKeyUrlRequest = request as! DiagnosisKeyUrlRequest
        XCTAssertEqual(diagnosisKeyUrlRequest.method, .get)
        XCTAssertEqual(requestType, RequestType.downloadKeys)
        return Result<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return Result<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder)
      }
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock,
                                          btSecureStorage: btSecureStorageMock)
    exposureManager.detectExposuresV2 { (result) in
      switch result {
      case .success(let files):
        XCTAssertEqual(files, 1)
      default: XCTFail()
      }
    }
    wait(for: [storeExposureExpectation], timeout:2)
  }

  @available(iOS 13.7, *)
  func testGetExposureConfigurationV2FallbackToDefault() {
    let enManagerMock = ENManagerMock()
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      return Result<String>.success("indexFilePath") as AnyObject
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      return Result<DailySummariesConfiguration>.failure(GenericError.unknown)
    }
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock)
    do {
      let config = try await(exposureManager.getExposureConfigurationV2())
      XCTAssertEqual(config, DailySummariesConfiguration.placeholder)
    } catch {
      XCTFail()
    }
  }
}

private var halloween: Date {
  var components = DateComponents()
  components.year = 2019
  components.month = 10
  components.day = 31
  let date = Calendar.current.date(from: components)
  return date!
}
