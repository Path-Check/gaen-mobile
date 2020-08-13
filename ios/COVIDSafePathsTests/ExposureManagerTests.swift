import Foundation
import ExposureNotification
import RealmSwift
import XCTest

@testable import BT

class BTSecureStorageMock: BTSecureStorage {

  var userStateHandler: (() -> UserState)?

  init() {
    super.init(inMemory: true)
  }

  override var userState: UserState {
    return userStateHandler?() ?? UserState()
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

  var dispatchQueue: DispatchQueue = DispatchQueue.main

  var invalidationHandler: (() -> Void)?

  func authorizationStatus() -> ENAuthorizationStatus {
    return authorizationStatusHandler?() ?? .unknown
  }

  var exposureNotificationEnabled: Bool {
    return exposureNotificationEnabledHandler?() ?? false
  }

  func detectExposures(configuration: ENExposureConfiguration, diagnosisKeyURLs: [URL], completionHandler: @escaping ENDetectExposuresHandler) -> Progress {
    return Progress()
  }

  func getExposureInfo(summary: ENExposureDetectionSummary, userExplanation: String, completionHandler: @escaping ENGetExposureInfoHandler) -> Progress {
    return Progress()
  }

  func getDiagnosisKeys(completionHandler: @escaping ENGetDiagnosisKeysHandler) {

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
    let btSecureStorageMock = BTSecureStorageMock()
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

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = ""
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    let paths = ExposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00001.zip")
    XCTAssertEqual(paths.last!, "mn/1593432000-1593446400-00015.zip")
  }
  
  func testUrlPathsToProcessSecondPass() {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593432000-1593446400-00015.zip"
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    let paths = ExposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00016.zip")
    XCTAssertEqual(paths.last!, "mn/1593446400-1593460800-00007.zip")
  }
  
  func testUrlPathsToProcessAfterReadingAllButOneFile() {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00021.zip"
    let paths = ExposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.count, 1)
  }
  
  func testUrlPathsToProcessAfterReadingAllFiles() {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    let paths = ExposureManager.urlPathsToProcess(indexTxt.gaenFilePaths)

    XCTAssertEqual(paths.count, 0)
  }
  
  func testUpdateRemainingFileCapacityFirstPass() {

    // Setup
    ExposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset!, to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func testUpdateRemainingFileCapacityUnder24Hours() {

    // Setup
    BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = 2
    ExposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset!, to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 2)
  }
  
  func testUpdateRemainingFileCapacityAfter24Hours() {

    // Setup
    let twoDaysAgo = Calendar.current.date(byAdding: .day, value: -2, to: Date())!
    BTSecureStorage.shared.dateLastPerformedFileCapacityReset = twoDaysAgo
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = 2
    ExposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset!, to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func testSuccessfulDetection() {

    // Setup
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity


    ExposureManager.shared?.finish(.success([]),
                                  processedFileCount: 4,
                                  lastProcessedUrlPath: "mn/1593460800-1593475200-00022.zip",
                                  progress: Progress()) { _ in }

    // remainingDailyFileProcessingCapacity decreases, urlOfMostRecentlyDetectedKeyFile is stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 11)

    // ----------------

    ExposureManager.shared?.finish(.success([]), processedFileCount: 8, lastProcessedUrlPath: "mn/1593460800-1593475200-00023.zip", progress: Progress()) { _ in }

    // remainingDailyFileProcessingCapacity decreases, urlOfMostRecentlyDetectedKeyFile is stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00023.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 3)

    // ----------------

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored if empty string
    ExposureManager.shared?.finish(.success([]),
                                  processedFileCount: 0,
                                  lastProcessedUrlPath: .default,
                                  progress: Progress()) { _ in }

    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00023.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 3)
  }
  
  func testFailedDetection() {

    // Setup
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    ExposureManager.shared?.finish(.failure(GenericError.unknown),
                                  processedFileCount: 4,
                                  lastProcessedUrlPath: "invalid",
                                  progress: Progress()) { _ in }

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }
  
  func testCancelledDetection() {

    // Setup
    let progress = Progress()
    progress.cancel()
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    ExposureManager.shared?.finish(.failure(GenericError.unknown), processedFileCount: 4,
                                  lastProcessedUrlPath: "invalid",
                                  progress: progress) { _ in }

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }

  func testExposureStorage() {

    // Setup
    BTSecureStorage.shared.resetUserState() { _ in }

    XCTAssertEqual(BTSecureStorage.shared.userState.exposures.count, 0)

    let exposure = Exposure(id: UUID().uuidString,
                            date: Date().posixRepresentation - Int(TimeInterval.random(in: 0...13)) * 24 * 60 * 60 * 1000,
                            duration: TimeInterval(Int.random(in: 1...10) * 60 * 5 * 1000),
                            totalRiskScore: .random(in: 1...8),
                            transmissionRiskLevel: .random(in: 0...7))
    ExposureManager.shared?.finish(.success([exposure]),
                                  processedFileCount: 4,
                                  lastProcessedUrlPath: .default,
                                  progress: Progress()) { _ in }
    XCTAssertEqual(BTSecureStorage.shared.userState.exposures.count, 1)
  }

  func testInitialFileCapacity() {

    // Setup
    BTSecureStorage.shared.resetUserState() { _ in }
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
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


