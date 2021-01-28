import Foundation
import XCTest
import ExposureNotification

@testable import BT

class IntegrationTests: XCTestCase {
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

  override class func setUp() {
    ExposureManager.createSharedInstance()
  }

  func testProcessesCorrectFilePathsDuringFirstRun() throws {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = ""
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    let exposureManager = try XCTUnwrap(ExposureManager.shared)
    let paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths, apiVersion: .V1)

    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00001.zip")
    XCTAssertEqual(paths.last!, "mn/1593432000-1593446400-00015.zip")
  }

  func testUrlPathsToProcessSecondPass() throws {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593432000-1593446400-00015.zip"
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    let exposureManager = try XCTUnwrap(ExposureManager.shared)

    let paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths, apiVersion: .V1)

    XCTAssertEqual(paths.first!, "mn/1593432000-1593446400-00016.zip")
    XCTAssertEqual(paths.last!, "mn/1593446400-1593460800-00007.zip")
  }

  func testUrlPathsToProcessRemainingFileCapacity() throws {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593432000-1593446400-00015.zip"
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = 4
    let exposureManager = try XCTUnwrap(ExposureManager.shared)

    let v1Paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths, apiVersion: .V1)
    let v2Paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths, apiVersion: .V2)

    XCTAssertEqual(v1Paths.first!, "mn/1593432000-1593446400-00016.zip")
    XCTAssertEqual(v1Paths.last!, "mn/1593432000-1593446400-00019.zip")
    XCTAssertEqual(v1Paths.count, 4)

    XCTAssertEqual(v2Paths.first!, "mn/1593432000-1593446400-00016.zip")
    XCTAssertEqual(v2Paths.last!, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(v2Paths.count, 53)
  }

  func testUrlPathsToProcessAfterReadingAllButOneFile() throws {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00021.zip"
    let exposureManager = try XCTUnwrap(ExposureManager.shared)

    let paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths, apiVersion: .V1)

    XCTAssertEqual(paths.count, 1)
  }

  func testUrlPathsToProcessAfterReadingAllFiles() throws {

    // Setup
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    let exposureManager = try XCTUnwrap(ExposureManager.shared)
    let paths = exposureManager.urlPathsToProcess(indexTxt.gaenFilePaths, apiVersion: .V1)

    XCTAssertEqual(paths.count, 0)
  }

  func testUpdateRemainingFileCapacityFirstPass() throws {

    // Setup
    let exposureManager = try XCTUnwrap(ExposureManager.shared)
    exposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset!, to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }

  func testUpdateRemainingFileCapacityUnder24Hours() throws {

    // Setup
    BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = 2
    let exposureManager = try XCTUnwrap(ExposureManager.shared)
    exposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset!, to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 2)
  }

  func testUpdateRemainingFileCapacityAfter24Hours() throws {

    // Setup
    let twoDaysAgo = Calendar.current.date(byAdding: .day, value: -2, to: Date())!
    BTSecureStorage.shared.dateLastPerformedFileCapacityReset = twoDaysAgo
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = 2
    let exposureManager = try XCTUnwrap(ExposureManager.shared)
    exposureManager.updateRemainingFileCapacity()
    let hoursSinceLastReset = Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset!, to: Date())

    XCTAssertEqual(hoursSinceLastReset, 0)
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }

  func testSuccessfulDetection() throws {
    let exposureManager = try XCTUnwrap(ExposureManager.shared)

    // Setup
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity


    exposureManager.finish(.success([]),
                                  processedFileCount: 4,
                                  lastProcessedUrlPath: "mn/1593460800-1593475200-00022.zip",
                                  progress: Progress(), apiVersion: .V1) { _ in }

    // remainingDailyFileProcessingCapacity decreases, urlOfMostRecentlyDetectedKeyFile is stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 11)

    // ----------------
    exposureManager.finish(.success([]), processedFileCount: 8, lastProcessedUrlPath: "mn/1593460800-1593475200-00023.zip", progress: Progress(), apiVersion: .V1) { _ in }

    // remainingDailyFileProcessingCapacity decreases, urlOfMostRecentlyDetectedKeyFile is stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00023.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 3)

    // ----------------
    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored if empty string
    exposureManager.finish(.success([]),
                                  processedFileCount: 0,
                                  lastProcessedUrlPath: .default,
                                  progress: Progress(), apiVersion: .V1) { _ in }

    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00023.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, 3)
  }

  func testFailedDetection() throws {

    // Setup
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    let exposureManager = try XCTUnwrap(ExposureManager.shared)

    exposureManager.finish(.failure(GenericError.unknown),
                                  processedFileCount: 4,
                                  lastProcessedUrlPath: "invalid",
                                  progress: Progress(), apiVersion: .V1) { _ in }

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }

  func testCancelledDetection() throws {

    // Setup
    let progress = Progress()
    progress.cancel()
    BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
    BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = "mn/1593460800-1593475200-00022.zip"
    let exposureManager = try XCTUnwrap(ExposureManager.shared)

    exposureManager.finish(.failure(GenericError.unknown), processedFileCount: 4,
                                  lastProcessedUrlPath: "invalid",
                                  progress: progress, apiVersion: .V1) { _ in }

    // remainingDailyFileProcessingCapacity does not decrease, urlOfMostRecentlyDetectedKeyFile is not stored
    XCTAssertEqual(BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile, "mn/1593460800-1593475200-00022.zip")
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }

  func testExposureStorage() throws {

    // Setup
    BTSecureStorage.shared.resetUserState() { _ in }
    let exposureManager = try XCTUnwrap(ExposureManager.shared)

    XCTAssertEqual(BTSecureStorage.shared.userState.exposures.count, 0)

    let exposure = Exposure(id: UUID().uuidString,
                            date: Date().posixRepresentation - Int(TimeInterval.random(in: 0...13)) * 24 * 60 * 60 * 1000,
                            weightedDurationSum: 2000)
    exposureManager.finish(.success([exposure]),
                           processedFileCount: 4,
                           lastProcessedUrlPath: .default,
                           progress: Progress(), apiVersion: .V1) { _ in }
    XCTAssertEqual(BTSecureStorage.shared.userState.exposures.count, 1)
  }

  func testInitialFileCapacity() {

    // Setup
    BTSecureStorage.shared.resetUserState() { _ in }
    XCTAssertEqual(BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, Constants.dailyFileProcessingCapacity)
  }

  func testFilterOldKeysForSubmission() throws {
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
