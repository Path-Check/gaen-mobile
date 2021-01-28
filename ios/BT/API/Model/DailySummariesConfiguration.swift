import Foundation
import ExposureNotification

@available(iOS 13.7, *)
struct DailySummariesConfiguration: ExposureConfiguration {

  static let configurationFileName = "v1.6.config.json"

  let attenuationDurationThresholds: [NSNumber]
  let attenuationBucketWeights: [Double]
  let reportTypeWeights: [Double]
  let reportTypeWhenMissing: Int
  let infectiousnessWeights: [Double]
  let infectiousnessWhenDaysSinceOnsetMissing: Int
  let triggerThresholdWeightedDuration: Int
  var daysSinceOnsetToInfectiousness: [NSNumber:NSNumber]

  static var placeholder: DailySummariesConfiguration = {
    let daysSinceOnsetToInfectiousness: [NSNumber:NSNumber] = [-14:0,
                                                               -13:0,
                                                               -12:0,
                                                               -11:0,
                                                               -10:0,
                                                               -9:0,
                                                               -8:0,
                                                               -7:0,
                                                               -6:0,
                                                               -5:0,
                                                               -4:0,
                                                               -3:1,
                                                               -2:1,
                                                               -1:1,
                                                               0:2,
                                                               1:2,
                                                               2:2,
                                                               3:2,
                                                               4:1,
                                                               5:0,
                                                               6:0,
                                                               7:0,
                                                               8:0,
                                                               9:0,
                                                               10:0,
                                                               11:0,
                                                               12:0,
                                                               13:0,
                                                               14:0]
    return DailySummariesConfiguration(attenuationDurationThresholds: [55, 63, 70],
                                       attenuationBucketWeights: [150, 100, 40, 0],
                                       reportTypeWeights: [100, 0, 0, 0],
                                       reportTypeWhenMissing: 1,
                                       infectiousnessWeights: [30, 100],
                                       infectiousnessWhenDaysSinceOnsetMissing: 1,
                                       triggerThresholdWeightedDuration: 15,
                                       daysSinceOnsetToInfectiousness: daysSinceOnsetToInfectiousness)
  }()

  var asENExposureConfiguration: ENExposureConfiguration {
    let config = ENExposureConfiguration()
    config.attenuationDurationThresholds = attenuationDurationThresholds
    config.immediateDurationWeight = attenuationBucketWeights[0]
    config.nearDurationWeight = attenuationBucketWeights[1]
    config.mediumDurationWeight = attenuationBucketWeights[2]
    config.otherDurationWeight = attenuationBucketWeights[3]
    config.infectiousnessStandardWeight = infectiousnessWeights[0]
    config.infectiousnessHighWeight = infectiousnessWeights[1]
    config.infectiousnessForDaysSinceOnsetOfSymptoms = daysSinceOnsetToInfectiousness
    config.reportTypeConfirmedTestWeight = reportTypeWeights[0]
    config.reportTypeConfirmedClinicalDiagnosisWeight = reportTypeWeights[1]
    config.reportTypeSelfReportedWeight = reportTypeWeights[2]
    config.reportTypeRecursiveWeight = reportTypeWeights[3]
    config.reportTypeNoneMap = ENDiagnosisReportType.confirmedTest
    return config
  }

  private static let infectiousnessValueUnknownDaysSinceOnsetOfSymptoms: NSNumber = 1
}

@available(iOS 13.7, *)
extension DailySummariesConfiguration: DownloadableFile {

  static func create(from data: Data) -> DailySummariesConfiguration? {
    guard var saveLocalPath = BTAPIClient.documentsDirectory else {
      return nil
    }
    saveLocalPath.appendPathComponent(DailySummariesConfiguration.configurationFileName)
    var dailySummariesConfiguration: DailySummariesConfiguration
    do {
      dailySummariesConfiguration = try parse(data: data)
      try data.write(to: saveLocalPath)
    } catch {
      do {
        let jsonData = try Data(contentsOf: saveLocalPath)
        dailySummariesConfiguration = try parse(data: jsonData)
      } catch {
        return nil
      }
    }
    return dailySummariesConfiguration
  }

  private static func parse(data: Data) throws -> DailySummariesConfiguration {
    let jsonObject = try JSONSerialization.jsonObject(with: data, options: []) as! [String:Any]
    let dailySummaryConfig = jsonObject["DailySummariesConfig"] as! [String:Any]
    let attenuationDurationThresholds: [NSNumber] = dailySummaryConfig["attenuationDurationThresholds"] as! [NSNumber]
    let attenuationBucketWeights: [Double] = dailySummaryConfig["attenuationBucketWeights"] as! [Double]
    let reportTypeWeights: [Double] = dailySummaryConfig["reportTypeWeights"] as! [Double]
    let reportTypeWhenMissing: Int = dailySummaryConfig["reportTypeWhenMissing"] as! Int
    let infectiousnessWeights: [Double] = dailySummaryConfig["infectiousnessWeights"] as! [Double]
    var daysSinceOnsetToInfectiousness: [NSNumber:NSNumber] = [:]
    (dailySummaryConfig["daysSinceOnsetToInfectiousness"] as! [[NSNumber]]).forEach { (element) in
      daysSinceOnsetToInfectiousness[element[0]] = element[1]
    }
    let infectiousnessWhenDaysSinceOnsetMissing: Int = dailySummaryConfig["infectiousnessWhenDaysSinceOnsetMissing"] as! Int
    let triggerThresholdWeightedDuration: Int = jsonObject["triggerThresholdWeightedDuration"] as! Int
    return DailySummariesConfiguration(attenuationDurationThresholds: attenuationDurationThresholds,
                                       attenuationBucketWeights: attenuationBucketWeights,
                                       reportTypeWeights: reportTypeWeights,
                                       reportTypeWhenMissing: reportTypeWhenMissing,
                                       infectiousnessWeights: infectiousnessWeights,
                                       infectiousnessWhenDaysSinceOnsetMissing: infectiousnessWhenDaysSinceOnsetMissing,
                                       triggerThresholdWeightedDuration: triggerThresholdWeightedDuration,
                                       daysSinceOnsetToInfectiousness: daysSinceOnsetToInfectiousness)
  }

}
