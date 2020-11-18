import Foundation
import UserNotifications
import BackgroundTasks
import ExposureNotification
import Promises
import XCTest

@testable import BT

class DebugMenuUnitTests: XCTestCase {

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


}
