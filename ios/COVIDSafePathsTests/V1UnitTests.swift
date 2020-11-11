import Foundation
import UserNotifications
import BackgroundTasks
import ExposureNotification
import Promises
import XCTest

@testable import BT

class V1UnitTests: XCTestCase {

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

}

