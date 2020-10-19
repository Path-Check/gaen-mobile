import Foundation
import ExposureNotification

protocol ExposureConfiguration: Equatable {

  static var placeholder: Self { get }

  var triggerThresholdWeightedDuration: Int { get }
  
  @available(iOS 13.5, *)
  var asENExposureConfiguration: ENExposureConfiguration { get }
}


struct ExposureConfigurationV1: ExposureConfiguration, Codable {

  let minimumRiskScore: ENRiskScore
  let attenuationDurationThresholds: [Int]
  let attenuationLevelValues: [ENRiskLevelValue]
  let daysSinceLastExposureLevelValues: [ENRiskLevelValue]
  let durationLevelValues: [ENRiskLevelValue]
  let transmissionRiskLevelValues: [ENRiskLevelValue]
  let attenuationBucketWeights: [Float]
  let triggerThresholdWeightedDuration: Int

  static var placeholder: ExposureConfigurationV1 = {
    ExposureConfigurationV1(minimumRiskScore: 0,
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

  // Each bucket is capped at 30 minutes, this method calculates what the
  // weighted duration ends up being capped at.

  var maxWeightedDuration: Int {
    return Int((attenuationBucketWeights[0] + attenuationBucketWeights[1] + attenuationBucketWeights[2]) * 30 * 60)
  }
}

extension ExposureConfigurationV1: DownloadableFile {

  static func create(from data: Data) -> ExposureConfigurationV1? {
    guard let saveLocalPath = BTAPIClient.documentsDirectory else {
      return nil
    }
    var exposureConfiguration: ExposureConfigurationV1
    do {
      exposureConfiguration = try JSONDecoder().decode(ExposureConfigurationV1.self,
                                                       from: data)
      try data.write(to: saveLocalPath)
    } catch {
      do {
        let jsonData = try Data(contentsOf: saveLocalPath)
        exposureConfiguration = try JSONDecoder().decode(ExposureConfigurationV1.self,
                                                         from: jsonData)
      } catch {
        return nil
      }
    }
    return exposureConfiguration
  }
}
