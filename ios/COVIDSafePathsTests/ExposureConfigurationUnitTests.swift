import Foundation
import UserNotifications
import BackgroundTasks
import ExposureNotification
import Promises
import XCTest

@testable import BT

class ExposureConfigurationUnitTests: XCTestCase {

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
                               "triggerThresholdWeightedDuration": 12]
    let jsonData = try! JSONSerialization.data(withJSONObject: dict)
    let config = DailySummariesConfiguration.create(from: jsonData)!
    XCTAssertEqual(config.daysSinceOnsetToInfectiousness[NSNumber(value: ENDaysSinceOnsetOfSymptomsUnknown)], 1)
    XCTAssertEqual(config.triggerThresholdWeightedDuration, 12)
  }

}
