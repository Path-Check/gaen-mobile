import Foundation
import UserNotifications
import BackgroundTasks
import ExposureNotification
import Promises
import XCTest

@testable import BT

@available(iOS 13.7, *)
class V2UnitTests: XCTestCase {

  // When `detectExposuresV2` is called
  // `lastExposureCheckDate` is persisted
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

  // When `detectExposuresV2` is called
  // and an exposure is detected
  // but the database already contains an exposure with the new exposure's date
  // the new exposure IS NOT persisted
  func testDetectExposuresSuccessPreexistingSavedExposureForDate() {
    let storeExposureExpectation = self.expectation(description: "The exposure does not get stored")

    let userState = UserState()
    userState.exposures.append(Exposure(id: "3",
                                        date: XCTestCase.halloween.posixRepresentation,
                                        weightedDurationSum: 2000))

    let exposureManager = defaultExposureManager(enAPIVersion: .v2, userState: userState)

    (exposureManager.btSecureStorage as! BTSecureStorageMock).storeExposuresHandler = { exposures in
      XCTAssertEqual(exposures.count, 0)
      storeExposureExpectation.fulfill()
    }

    exposureManager.detectExposuresV2 { _ in }

    wait(for: [storeExposureExpectation], timeout: 5)
  }

  // When `detectExposuresV2` is called
  // and an exposure is detected
  // but the database does NOT already contain an exposure with the new exposure's date
  // the new exposure IS persisted
  func testDetectExposuresSuccessNoPreexistingSavedExposureForDate() {
    let storeExposureExpectation = self.expectation(description: "The exposure is stored")
    let userState = UserState()
    userState.exposures.append(Exposure(id: "3",
                                        date: Date().posixRepresentation,
                                        weightedDurationSum: 2000))

    let exposureManager = defaultExposureManager(enAPIVersion: .v2, userState: userState)
    (exposureManager.btSecureStorage as! BTSecureStorageMock).storeExposuresHandler = { exposures in
      XCTAssertEqual(exposures.count, 1)
      storeExposureExpectation.fulfill()
    }

    exposureManager.detectExposuresV2 { _ in }

    wait(for: [storeExposureExpectation], timeout: 5)
  }

  // When `detectExposuresV2` is called
  // and an exposure is detected
  // and the new exposure does not meet the scoring threshold
  // the new exposure is NOT stored
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

  // When `detectExposuresV2` is called
  // and an exposure is detected
  // and the new exposure meets the scoring threshold
  // the new exposure is stored
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

  // When `detectExposuresV2` is called
  // and the request to download the exposure configuration fails
  // the fallback exposure configuration is used
  func testGetExposureConfigurationV2FallbackToDefault() {
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      return GenericResult<String>.success("indexFilePath") as AnyObject
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      return GenericResult<DailySummariesConfiguration>.failure(GenericError.unknown)
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

  // When exposure detection results in an error
  // The error has a localized description
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

}
