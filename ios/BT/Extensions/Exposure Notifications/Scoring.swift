import Foundation
import ExposureNotification

extension ExposureManager {

  private static let matchedKeyCountMax = 3

  static func score(summary: ENExposureDetectionSummary,
                    with configuration: ExposureConfiguration) -> Bool {
    let matchedKeyCount = Int(summary.matchedKeyCount)
    if matchedKeyCount == 0 {
      return false
    }
    if summary.matchedKeyCount <= matchedKeyCountMax {
      // If the weighted average duration per matched key exceeds the
      // threshold, we know that there was at least one day where the exposure
      // exceeded the threshold.
      let weightedDurationForKeys = weightedDuration(summary: summary,
                                              config: configuration) / matchedKeyCount
      if (weightedDurationForKeys >= configuration.triggerThresholdWeightedDuration * 60) {
        return true
      } else {
        return false
      }
    } else {
      // If the # matched keys is 4 or more, average duration is no longer
      // useful because we have reached the cap of the attenuation buckets.
      // (This assumes a trigger threshold of 15 minutes.)
      if weightedDuration(summary: summary, config: configuration) >= configuration.maxWeightedDuration {
        return true
      } else {
        return false
      }
    }
  }

  // Note: This is measured in seconds, while the config value is set in minutes and needs to be multiplied by 60.

  static func weightedDuration(summary : ENExposureDetectionSummary,
                               config: ExposureConfiguration) -> Int {
    let weightedDuration =
      config.attenuationBucketWeights[0] * summary.attenuationDurations[0].floatValue +
      config.attenuationBucketWeights[1] * summary.attenuationDurations[1].floatValue +
      config.attenuationBucketWeights[2] * summary.attenuationDurations[2].floatValue
    return Int(weightedDuration)
  }
}

extension ExposureConfiguration {

  // Each bucket is capped at 30 minutes, this method calculates what the
  // weighted duration ends up being capped at.

  var maxWeightedDuration: Int {
    return Int((attenuationBucketWeights[0] + attenuationBucketWeights[1] + attenuationBucketWeights[2]) * 30 * 60)
  }
}
