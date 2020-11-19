import Foundation
import UserNotifications
import BackgroundTasks
import ExposureNotification
import Promises
import XCTest

@testable import BT

class ExposureConfigurationV1UnitTests: XCTestCase {

  // When matched key count is 0
  func testExposureSummaryScoringMatchedKey0() {
    let enExposureSummary = MockENExposureDetectionSummary()
    enExposureSummary.matchedKeyCountHandler = {
      return 0
    }
    XCTAssertFalse(enExposureSummary.isAboveScoreThreshold(with: ExposureConfigurationV1.placeholder))
  }

  // When matched key count is 1
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

  // When matched key count is 3
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

  // When matched key count is 4
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

}
