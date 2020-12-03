import Foundation
import UserNotifications
import BackgroundTasks
import ExposureNotification
import Promises
import XCTest

@testable import BT

@available(iOS 13.7, *)
class DailySummariesConfigurationUnitTests: XCTestCase {

  // JSON can be deserialized into a DailySummariesConfiguration
  func testValidDailySummariesConfiguration() {
    let dict: [String: Any] = ["DailySummariesConfig": ["attenuationDurationThresholds": [40,53,60],
                                                        "attenuationBucketWeights": [1,1,0.5,0],
                                                        "reportTypeWeights": [1,0,0,0] as [Double],
                                                        "reportTypeWhenMissing": 1,
                                                        "infectiousnessWeights": [1,1] as [Double],
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
                               "triggerThresholdWeightedDuration": 12]
    let jsonData = try! JSONSerialization.data(withJSONObject: dict)
    let config = DailySummariesConfiguration.create(from: jsonData)!
    let dictConfig = dict["DailySummariesConfig"] as! [String: Any]

    XCTAssertEqual(config.triggerThresholdWeightedDuration, dict["triggerThresholdWeightedDuration"] as! Int)
    XCTAssertEqual(config.attenuationDurationThresholds, dictConfig["attenuationDurationThresholds"] as! [NSNumber])
    XCTAssertEqual(config.attenuationBucketWeights, dictConfig["attenuationBucketWeights"] as! [Double])
    XCTAssertEqual(config.reportTypeWeights, dictConfig["reportTypeWeights"] as! [Double])
    XCTAssertEqual(config.reportTypeWhenMissing, dictConfig["reportTypeWhenMissing"] as! Int)
    XCTAssertEqual(config.infectiousnessWeights, dictConfig["infectiousnessWeights"] as! [Double])
    XCTAssertEqual(config.infectiousnessWhenDaysSinceOnsetMissing, dictConfig["infectiousnessWhenDaysSinceOnsetMissing"] as! Int)
  }

  // When dailySummary weightedDurationSum is below the exposure configuration's triggerThresholdWeightedDuration
  // the scoring threshold is not met
  func testDailySummaryBelowScoringThreshold() {
    let config = DailySummariesConfiguration.placeholder
    let daySummary = MockENExposureDaySummary()
    let daySummaryItem = MockENExposureSummaryItem()
    daySummary.daySummaryHandler = {
      return daySummaryItem
    }
    daySummaryItem.weightedDurationSumHandler = {
      return TimeInterval(config.triggerThresholdWeightedDuration - 1)
    }
    let isAboveThreshold = daySummary.isAboveScoreThreshold(with: config)
    
    XCTAssertFalse(isAboveThreshold)
  }

  // When dailySummary weightedDurationSum is equal to the exposure configuration's triggerThresholdWeightedDuration
  // the scoring threshold is met
  func testDailySummaryEqualToScoringThreshold() {
    let config = DailySummariesConfiguration.placeholder
    let daySummary = MockENExposureDaySummary()
    let daySummaryItem = MockENExposureSummaryItem()
    daySummary.daySummaryHandler = {
      return daySummaryItem
    }
    daySummaryItem.weightedDurationSumHandler = {
      return TimeInterval(config.triggerThresholdWeightedDuration * 60) // 15 minutes
    }
    let isAboveThreshold = daySummary.isAboveScoreThreshold(with: config)

    XCTAssertTrue(isAboveThreshold)
  }

  // When dailySummary weightedDurationSum is above the exposure configuration's triggerThresholdWeightedDuration
  // the scoring threshold is met
  func testDailySummaryAboveScoringThreshold() {
    let config = DailySummariesConfiguration.placeholder
    let daySummary = MockENExposureDaySummary()
    let daySummaryItem = MockENExposureSummaryItem()
    daySummary.daySummaryHandler = {
      return daySummaryItem
    }
    daySummaryItem.weightedDurationSumHandler = {
      return TimeInterval(config.triggerThresholdWeightedDuration * 60) + 1 // 15:01
    }
    let isAboveThreshold = daySummary.isAboveScoreThreshold(with: config)

    XCTAssertTrue(isAboveThreshold)
  }


}
