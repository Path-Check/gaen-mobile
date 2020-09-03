import Foundation
import ExposureNotification

struct ExposureConfiguration: Codable {

  static let configurationFileName = "v1.config.json"

  let minimumRiskScore: ENRiskScore
  let attenuationDurationThresholds: [Int]
  let attenuationLevelValues: [ENRiskLevelValue]
  let daysSinceLastExposureLevelValues: [ENRiskLevelValue]
  let durationLevelValues: [ENRiskLevelValue]
  let transmissionRiskLevelValues: [ENRiskLevelValue]
  let attenuationBucketWeights: [Float]
  let triggerThresholdWeightedDuration: Int

}

extension ExposureConfiguration {

  static var placeholder: ExposureConfiguration = {
    ExposureConfiguration(minimumRiskScore: 0,
                          attenuationDurationThresholds: [53, 60],
                          attenuationLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
                          daysSinceLastExposureLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
                          durationLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
                          transmissionRiskLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
                          attenuationBucketWeights: [1, 0.5, 0],
                          triggerThresholdWeightedDuration: 15)
  }()

  var asENExposureConfiguration: ENExposureConfiguration {
    let config = ENExposureConfiguration()
    config.metadata = ["attenuationDurationThresholds": attenuationDurationThresholds]
    config.attenuationLevelValues = attenuationLevelValues.map { NSNumber(value: $0) }
    config.daysSinceLastExposureLevelValues = daysSinceLastExposureLevelValues.map { NSNumber(value: $0) }
    config.durationLevelValues = durationLevelValues.map { NSNumber(value: $0) }
    config.transmissionRiskLevelValues = transmissionRiskLevelValues.map { NSNumber(value: $0) }
    return config
  }
}

extension ExposureConfiguration: DownloadableFile {

  static func create(from data: Data) -> ExposureConfiguration? {
    guard var saveLocalPath = BTAPIClient.documentsDirectory else {
      return nil
    }
    saveLocalPath.appendPathComponent(ExposureConfiguration.configurationFileName)
    var exposureConfiguration: ExposureConfiguration
    do {
      exposureConfiguration = try JSONDecoder().decode(ExposureConfiguration.self,
                                      from: data)
      try data.write(to: saveLocalPath)
    } catch {
      do {
        let jsonData = try Data(contentsOf: saveLocalPath)
        exposureConfiguration = try JSONDecoder().decode(ExposureConfiguration.self,
                                        from: jsonData)
      } catch {
        return nil
      }
    }
    return exposureConfiguration
  }
}
