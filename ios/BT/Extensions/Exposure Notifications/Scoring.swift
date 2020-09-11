import Foundation
import ExposureNotification


protocol Scoring {

  associatedtype T: ExposureConfiguration

  func isAboveScoreThreshold(with configuration: T) -> Bool
}

extension ENExposureDetectionSummary: Scoring {

  func isAboveScoreThreshold(with configuration: ExposureConfigurationV1) -> Bool {

    let matchedKeyCountMax = 3

    let matchedKeyCount = Int(self.matchedKeyCount)
    if matchedKeyCount == 0 {
      return false
    }
    if matchedKeyCount <= matchedKeyCountMax {
      // If the weighted average duration per matched key exceeds the
      // threshold, we know that there was at least one day where the exposure
      // exceeded the threshold.
      let weightedDurationForKeys = weightedDuration(configuration: configuration) / matchedKeyCount
      let isAboveAverageDurationThreshold = (weightedDurationForKeys >= configuration.triggerThresholdWeightedDuration * 60)
      return isAboveAverageDurationThreshold
    } else {
      // If the # matched keys is 4 or more, average duration is no longer
      // useful because we have reached the cap of the attenuation buckets.
      // (This assumes a trigger threshold of 15 minutes.)
      let isAboveMaxDurationThreshold = (weightedDuration(configuration: configuration) >= configuration.maxWeightedDuration)
      return isAboveMaxDurationThreshold
    }
  }

  // Note: This is measured in seconds, while the config value is set in minutes and needs to be multiplied by 60.

  func weightedDuration(configuration: ExposureConfigurationV1) -> Int {
    let weightedDuration =
      configuration.attenuationBucketWeights[0] * attenuationDurations[0].floatValue +
      configuration.attenuationBucketWeights[1] * attenuationDurations[1].floatValue +
      configuration.attenuationBucketWeights[2] * attenuationDurations[2].floatValue
    return Int(weightedDuration)
  }
}

@available(iOS 13.7, *)
extension ENExposureDaySummary: Scoring {
  typealias T = DailySummariesConfiguration

  func isAboveScoreThreshold(with configuration: DailySummariesConfiguration) -> Bool {
    return Int(daySummary.weightedDurationSum) >= configuration.triggerThresholdWeightedDuration
  }
}
