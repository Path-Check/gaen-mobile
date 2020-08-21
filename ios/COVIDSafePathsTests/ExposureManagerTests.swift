import Foundation
import UserNotifications
import BackgroundTasks
import ExposureNotification
import RealmSwift
import XCTest

@testable import BT

// MARK: == Mocks ==

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

  init(notificationCenter: NotificationCenter) {
    super.init(inMemory: true, notificationCenter: notificationCenter)
  }

  override var userState: UserState {
    return userStateHandler?() ?? super.userState
  }
}

class APIClientMock<U: APIRequest>: APIClient {

  var requestHander: (_ request: U, RequestType) -> Result<U.ResponseType>

  init(requestHander: @escaping (_ request: U, _ requestType: RequestType) -> Result<U.ResponseType>) {
    self.requestHander = requestHander
  }

  static var documentsDirectory: URL? {
    return nil
  }

  func request<T>(_ request: T, requestType: RequestType, completion: @escaping GenericCompletion) where T : APIRequest, T.ResponseType == Void {

  }

  func downloadRequest<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<DownloadedPackage>) -> Void) where T : APIRequest {

  }

  func request<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<JSONObject>) -> Void) where T : APIRequest, T.ResponseType == JSONObject {

  }

  func request<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<T.ResponseType>) -> Void) where T : APIRequest, T.ResponseType : Decodable {
    completion(requestHander(request as! U, requestType) as! Result<T.ResponseType>)
  }

  func requestList<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<[T.ResponseType.Element]>) -> Void) where T : APIRequest, T.ResponseType : Collection, T.ResponseType.Element : Decodable {

  }

  func requestString<T>(_ request: T, requestType: RequestType, completion: @escaping (Result<T.ResponseType>) -> Void) where T : APIRequest, T.ResponseType == String {

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

  var activateHandler: ((_ completionHandler: @escaping ENErrorHandler) -> Void)?
  var invalidateHandler: (() -> Void)?
  var setExposureNotificationEnabledHandler: ((_ enabled: Bool, _ completionHandler: @escaping ENErrorHandler) -> Void)?
  var exposureNotificationEnabledHandler: (() -> Bool)?
  var exposureNotificationStatusHandler: (() -> ENStatus)?
  var authorizationStatusHandler: (() -> ENAuthorizationStatus)?
  var getDiagnosisKeysHandler: ((ENGetDiagnosisKeysHandler) -> ())?
  var detectExposuresHandler: ((_ configuration: ENExposureConfiguration, _ diagnosisKeyURLs: [URL], _ completionHandler: @escaping ENDetectExposuresHandler) -> Progress)?
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
    return Progress()
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

class BGTaskSchedulerMock: BGTaskScheduler {

  override func register(forTaskWithIdentifier identifier: String, using queue: DispatchQueue?, launchHandler: @escaping (BGTask) -> Void) -> Bool {
    return false
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
    let exposureConfigurationRequestExpectation = self.expectation(description: "A request to get the exposure configuration is made")
    let apiClientMock = APIClientMock<ExposureConfigurationRequest> { (request, requestType) -> Result<ExposureConfiguration> in
      exposureConfigurationRequestExpectation.fulfill()
      return Result.success(ExposureConfiguration.placeholder)
    }
    let broadcastAuthorizationStateExpectation = self.expectation(description: "A notification is post with the current authorization and enabled stated")
    let notificationCenterMock = NotificationCenterMock()
    notificationCenterMock.postHandler = { notification in
      if notification.name == .AuthorizationStatusDidChange {
        broadcastAuthorizationStateExpectation.fulfill()
      }
    }
    let exposureManager = ExposureManager(apiClient: apiClientMock,
                                          notificationCenter: notificationCenterMock)
    exposureManager.awake()
    wait(for: [exposureConfigurationRequestExpectation,
               broadcastAuthorizationStateExpectation], timeout: 0)
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
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.exposures.append(Exposure(id: "1",
                                          date: 0,
                                          duration: 10,
                                          totalRiskScore: ENRiskScore(ENRiskScoreMin),
                                          transmissionRiskLevel: ENRiskScore(ENRiskScoreMin)))
      return userState
    }
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    let currentExposures = exposureManager.currentExposures
    XCTAssertNoThrow(try JSONDecoder().decode(Array<Exposure>.self, from: currentExposures.data(using: .utf8) ?? Data()))
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

  func testPostDiagnosisKeys() {
    let mockENManager = ENManagerMock()
    let expectation = self.expectation(description: "a call is made to get the diagnosis keys")
    let keychainSetRevisionTokenExpectation = self.expectation(description: "store the new revision token")
    mockENManager.getDiagnosisKeysHandler = { callback in
      expectation.fulfill()
      callback([ENTemporaryExposureKey()], nil)
    }
    let apiClientMock = APIClientMock<DiagnosisKeyListRequest> { (request, requestType) -> Result<KeySubmissionResponse> in
      XCTAssertEqual(requestType, RequestType.postKeys)
      let keySubmissionSuccess = KeySubmissionResponse(revisionToken: "revision_token")
      return Result.success(keySubmissionSuccess)
    }
    let keychainServiceMock = KeychainServiceMock()
    keychainServiceMock.setRevisionTokenHandler = { newToken in
      keychainSetRevisionTokenExpectation.fulfill()
      XCTAssertEqual(newToken, "revision_token")
    }
    let exposureManager = ExposureManager(exposureNotificationManager: mockENManager,
                                          apiClient: apiClientMock,
                                          keychainService: keychainServiceMock)
    exposureManager.getAndPostDiagnosisKeys(certificate: "certificate",
                                            HMACKey: "HMACKey") { (success, error) in
                                              XCTAssertEqual(error?.errorCode,
                                                             ExposureManagerErrorCode.noExposureKeysFound.rawValue,
                                                             "it returns an error since no key matches the criteria")
    }
    wait(for: [expectation], timeout: 0)
    mockENManager.getDiagnosisKeysHandler = { callback in
      callback(nil, GenericError.unknown)
    }
    exposureManager.getAndPostDiagnosisKeys(certificate: "certificate",
                                            HMACKey: "HMACKey") { (success, error) in
                                              XCTAssertEqual(error?.errorCode,
                                                             ExposureManagerErrorCode.noExposureKeysFound.rawValue,
                                                             "it returns an error since the underlying manager returns an error")
    }
    mockENManager.getDiagnosisKeysHandler = { callback in
      let exposureKey = ENTemporaryExposureKey()
      var keys = [exposureKey]
      let currentExposureKey = ENTemporaryExposureKey()
      currentExposureKey.rollingStartNumber = keys.minRollingStartNumber() + 10
      keys.append(currentExposureKey)
      callback(keys, nil)
    }
    exposureManager.getAndPostDiagnosisKeys(certificate: "certificate",
                                            HMACKey: "HMACKey") { (success, error) in
                                              XCTAssertNil(error)
    }
    wait(for: [keychainSetRevisionTokenExpectation], timeout: 0)

    let failApiClientMock = APIClientMock<DiagnosisKeyListRequest> { (request, requestType) -> Result<KeySubmissionResponse> in
      return Result.failure(GenericError.notFound)
    }
    let anotherExposureManager = ExposureManager(exposureNotificationManager: mockENManager,
                                          apiClient: failApiClientMock)
    anotherExposureManager.getAndPostDiagnosisKeys(certificate: "certificate",
                                            HMACKey: "HMACKey") { (success, error) in
                                              XCTAssertEqual(error?.errorCode,
                                                             ExposureManagerErrorCode.networkFailure.rawValue,
                                                             "it returns an error since the underlying api call returns an error")
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
    let enManagerMock = ENManagerMock()
    enManagerMock.detectExposuresHandler = { configuration, diagnosisKeyURLs, completionHanlder in
      return Progress()
    }
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
      let debugAction = DebugAction.fetchExposures
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

    func testDebugGetAndPostDiagnosisKeys() {
      let apiClientMock = APIClientMock<DiagnosisKeyListRequest> { (request, requestType) -> Result<KeySubmissionResponse> in
        XCTAssertEqual(requestType, RequestType.postKeys)
        let keySubmissionSuccess = KeySubmissionResponse(revisionToken: "revision_token")
        return Result.success(keySubmissionSuccess)
      }
      let debugAction = DebugAction.getAndPostDiagnosisKeys
      let enManagerMock = ENManagerMock()
      enManagerMock.getDiagnosisKeysHandler = { callback in
        let exposureKey = ENTemporaryExposureKey()
        var keys = [exposureKey]
        let currentExposureKey = ENTemporaryExposureKey()
        currentExposureKey.rollingStartNumber = keys.minRollingStartNumber() + 10
        keys.append(currentExposureKey)
        callback(keys, nil)
      }
      let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock, apiClient: apiClientMock)
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

// MARK: == INTEGRATION TESTS ==
  let indexTxt = """
mn/1593432000-1593446400-00001.zip
mn/1593432000-1593446400-00002.zip
mn/1593432000-1593446400-00003.zip
mn/1593432000-1593446400-00004.zip
mn/1593432000-1593446400-00005.zip
mn/1593432000-1593446400-00006.zip
mn/1593432000-1593446400-00007.zip
mn/1593432000-1593446400-00008.zip
mn/1593432000-1593446400-00009.zip
mn/1593432000-1593446400-00010.zip
mn/1593432000-1593446400-00011.zip
mn/1593432000-1593446400-00012.zip
mn/1593432000-1593446400-00013.zip
mn/1593432000-1593446400-00014.zip
mn/1593432000-1593446400-00015.zip
mn/1593432000-1593446400-00016.zip
mn/1593432000-1593446400-00017.zip
mn/1593432000-1593446400-00018.zip
mn/1593432000-1593446400-00019.zip
mn/1593432000-1593446400-00020.zip
mn/1593432000-1593446400-00021.zip
mn/1593432000-1593446400-00022.zip
mn/1593432000-1593446400-00023.zip
mn/1593446400-1593460800-00001.zip
mn/1593446400-1593460800-00002.zip
mn/1593446400-1593460800-00003.zip
mn/1593446400-1593460800-00004.zip
mn/1593446400-1593460800-00005.zip
mn/1593446400-1593460800-00006.zip
mn/1593446400-1593460800-00007.zip
mn/1593446400-1593460800-00008.zip
mn/1593446400-1593460800-00009.zip
mn/1593446400-1593460800-00010.zip
mn/1593446400-1593460800-00011.zip
mn/1593446400-1593460800-00012.zip
mn/1593446400-1593460800-00013.zip
mn/1593446400-1593460800-00014.zip
mn/1593446400-1593460800-00015.zip
mn/1593446400-1593460800-00016.zip
mn/1593446400-1593460800-00017.zip
mn/1593446400-1593460800-00018.zip
mn/1593446400-1593460800-00019.zip
mn/1593446400-1593460800-00020.zip
mn/1593446400-1593460800-00021.zip
mn/1593446400-1593460800-00022.zip
mn/1593446400-1593460800-00023.zip
mn/1593460800-1593475200-00001.zip
mn/1593460800-1593475200-00002.zip
mn/1593460800-1593475200-00003.zip
mn/1593460800-1593475200-00004.zip
mn/1593460800-1593475200-00005.zip
mn/1593460800-1593475200-00006.zip
mn/1593460800-1593475200-00007.zip
mn/1593460800-1593475200-00008.zip
mn/1593460800-1593475200-00009.zip
mn/1593460800-1593475200-00010.zip
mn/1593460800-1593475200-00011.zip
mn/1593460800-1593475200-00012.zip
mn/1593460800-1593475200-00013.zip
mn/1593460800-1593475200-00014.zip
mn/1593460800-1593475200-00015.zip
mn/1593460800-1593475200-00016.zip
mn/1593460800-1593475200-00017.zip
mn/1593460800-1593475200-00018.zip
mn/1593460800-1593475200-00019.zip
mn/1593460800-1593475200-00020.zip
mn/1593460800-1593475200-00021.zip
mn/1593460800-1593475200-00022.zip
"""
  
  func testProcessesCorrectFilePathsDuringFirstRun() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    let userState = UserState()
    btSecureStorageMock.userStateHandler = {
      return userState
    }
    btSecureStorageMock.urlOfMostRecentlyDetectedKeyFile = ""
    btSecureStorageMock.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    let paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00001.zip")
    XCTAssertEqual(paths.last!, "mn/1593432000-1593446400-00015.zip")
  }
  
  func testUrlPathsToProcessSecondPass() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    let userState = UserState()
    userState.urlOfMostRecentlyDetectedKeyFile = "mn/1593432000-1593446400-00015.zip"
    btSecureStorageMock.userStateHandler = {
      return userState
    }
    btSecureStorageMock.urlOfMostRecentlyDetectedKeyFile = "mn/1593432000-1593446400-00015.zip"
    btSecureStorageMock.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    let paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00016.zip")
    XCTAssertEqual(paths.last!, "mn/1593446400-1593460800-00007.zip")
  }
  
  func testUrlPathsToProcessAfterReadingAllButOneFile() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    let userState = UserState()
    userState.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00021.zip"
    btSecureStorageMock.userStateHandler = {
      return userState
    }
    btSecureStorageMock.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00021.zip"
    let paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.count, 1)
  }
  
  func testUrlPathsToProcessAfterReadingAllFiles() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    let userState = UserState()
    userState.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    btSecureStorageMock.userStateHandler = {
      return userState
    }
    btSecureStorageMock.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    let paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.count, 0)
  }
  
  func testUpdateRemainingFileCapacityFirstPass() {
    let notificationCenter = NotificationCenter()
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: notificationCenter)
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock, notificationCenter: notificationCenter)

    // Setup
//    let userState = UserState()
//    btSecureStorageMock.userStateHandler = {
//      return userState
//    }
//    exposureManager.updateRemainingFileCapacity()
//    let hoursSinceLastReset = Date.hourDifference(from: btSecureStorageMock.userState.dateLastPerformedFileCapacityReset!, to: Date())
//
//    XCTAssertEqual(hoursSinceLastReset, 0)
//    XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func testUpdateRemainingFileCapacityUnder24Hours() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    let userState = UserState()
    userState.dateLastPerformedFileCapacityReset = Calendar.current.date(byAdding: .day, value: -2, to: Date())!
    btSecureStorageMock.userStateHandler = {
      return userState
    }
    btSecureStorageMock.dateLastPerformedFileCapacityReset = Date()
    btSecureStorageMock.remainingDailyFileProcessingCapacity = 2
    exposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: btSecureStorageMock.userState.dateLastPerformedFileCapacityReset!,
                                                  to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity, 2)
  }
  
  func testUpdateRemainingFileCapacityAfter24Hours() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    let twoDaysAgo = Calendar.current.date(byAdding: .day, value: -2, to: Date())!
    let userState = UserState()
    userState.dateLastPerformedFileCapacityReset = Date()

    btSecureStorageMock.userStateHandler = {
      return userState
    }
    btSecureStorageMock.dateLastPerformedFileCapacityReset = twoDaysAgo
    btSecureStorageMock.remainingDailyFileProcessingCapacity = 2
    exposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: btSecureStorageMock.userState.dateLastPerformedFileCapacityReset!,
                                                  to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func testSuccessfulDetection() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    btSecureStorageMock.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity


    exposureManager.finish(.success([]),
                           processedFileCount: 4,
                           lastProcessedUrlPath: "mn/1593460800-1593475200-00022.zip",
                           progress: Progress()) { _ in }

    // remainingDailyFileProcessingCapacity decreases, urlOfMostRecentlyDetectedKeyFile is stored
    XCTAssertEqual(btSecureStorageMock.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity, 11)

    // ----------------

    exposureManager.finish(.success([]), processedFileCount: 8, lastProcessedUrlPath: "mn/1593460800-1593475200-00023.zip", progress: Progress()) { _ in }

    // remainingDailyFileProcessingCapacity decreases, urlOfMostRecentlyDetectedKeyFile is stored
    XCTAssertEqual(btSecureStorageMock.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00023.zip")
    XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity, 3)

    // ----------------

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored if empty string
    exposureManager.finish(.success([]),
                           processedFileCount: 0,
                           lastProcessedUrlPath: .default,
                           progress: Progress()) { _ in }

    XCTAssertEqual(btSecureStorageMock.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00023.zip")
    XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity, 3)
  }
  
  func testFailedDetection() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    btSecureStorageMock.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    btSecureStorageMock.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    exposureManager.finish(.failure(GenericError.unknown),
                           processedFileCount: 4,
                           lastProcessedUrlPath: "invalid",
                           progress: Progress()) { _ in }

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored
    XCTAssertEqual(btSecureStorageMock.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func testCancelledDetection() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    let progress = Progress()
    progress.cancel()
    btSecureStorageMock.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    btSecureStorageMock.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    exposureManager.finish(.failure(GenericError.unknown),
                           processedFileCount: 4,
                           lastProcessedUrlPath: "invalid",
                           progress: progress) { _ in }

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored
    XCTAssertEqual(btSecureStorageMock.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }

  func testExposureStorage() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    let exposureManager = ExposureManager(btSecureStorage: btSecureStorageMock)
    // Setup
    let userState = UserState()
    btSecureStorageMock.userStateHandler = {
      return userState
    }
    btSecureStorageMock.resetUserState() { _ in }

    XCTAssertEqual(btSecureStorageMock.userState.exposures.count, 0)

    let exposure = Exposure(id: UUID().uuidString,
                            date: Date().posixRepresentation - Int(TimeInterval.random(in: 0...13)) * 24 * 60 * 60 * 1000,
                            duration: TimeInterval(Int.random(in: 1...10) * 60 * 5 * 1000),
                            totalRiskScore: .random(in: 1...8),
                            transmissionRiskLevel: .random(in: 0...7))
    exposureManager.finish(.success([exposure]),
                           processedFileCount: 4,
                           lastProcessedUrlPath: .default,
                           progress: Progress()) { _ in }
    XCTAssertEqual(btSecureStorageMock.userState.exposures.count, 1)
  }

  func testInitialFileCapacity() {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())

    // Setup
    btSecureStorageMock.resetUserState() { _ in }
    XCTAssertEqual(btSecureStorageMock.userState.remainingDailyFileProcessingCapacity,
                   Constants.dailyFileProcessingCapacity)
  }

  func testFilterOldKeysForSubmission() {
    // Keys older than 350 hours should not be submitted
    
    let oneMonthAgo: Date = Calendar.current.date(byAdding: .month, value: -1, to: Date())!
    let oneWeekAgo: Date = Calendar.current.date(byAdding: .day, value: -7, to: Date())!
    let today: Date = Date()

    let keyA = ENTemporaryExposureKey()
    keyA.rollingStartNumber = ENTemporaryExposureKey.rollingStartNumber(oneMonthAgo)

    let keyB = ENTemporaryExposureKey()
    keyB.rollingStartNumber = ENTemporaryExposureKey.rollingStartNumber(oneWeekAgo)

    let keyC = ENTemporaryExposureKey()
    keyC.rollingStartNumber = ENTemporaryExposureKey.rollingStartNumber(today)

    let currentKeys = [keyA, keyB, keyC].current()

    XCTAssertFalse(currentKeys.contains(keyA))
    XCTAssertTrue(currentKeys.contains(keyB))
    XCTAssertTrue(currentKeys.contains(keyC))
  }

}


