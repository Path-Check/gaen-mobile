import Foundation
import UserNotifications
import BackgroundTasks
import ExposureNotification
import Promises
import XCTest

@testable import BT

class DailySummariesConfigurationUnitTests: XCTestCase {

  // JSON can be deserialized into a DailySummariesConfiguration
  @available(iOS 13.7, *)
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
    let dictDaysSinceOnsetToInfectiousness: [NSNumber: NSNumber] = (dictConfig["daysSinceOnsetToInfectiousness"] as! [[NSNumber]]).reduce([NSNumber(value: ENDaysSinceOnsetOfSymptomsUnknown): 1], {(result, next) in
      var copy = result
      copy[next[0]] = next[1]
      return copy
    })

    XCTAssertEqual(config.triggerThresholdWeightedDuration, dict["triggerThresholdWeightedDuration"] as! Int)
    XCTAssertEqual(config.attenuationDurationThresholds, dictConfig["attenuationDurationThresholds"] as! [NSNumber])
    XCTAssertEqual(config.attenuationBucketWeights, dictConfig["attenuationBucketWeights"] as! [Double])
    XCTAssertEqual(config.reportTypeWeights, dictConfig["reportTypeWeights"] as! [Double])
    XCTAssertEqual(config.reportTypeWhenMissing, dictConfig["reportTypeWhenMissing"] as! Int)
    XCTAssertEqual(config.infectiousnessWeights, dictConfig["infectiousnessWeights"] as! [Double])
    XCTAssertEqual(config.infectiousnessWhenDaysSinceOnsetMissing, dictConfig["infectiousnessWhenDaysSinceOnsetMissing"] as! Int)
    XCTAssertEqual(config.daysSinceOnsetToInfectiousness, dictDaysSinceOnsetToInfectiousness)
  }

}
