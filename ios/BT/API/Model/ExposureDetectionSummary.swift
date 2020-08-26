import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class ExposureDetectionSummary: Object, Codable {
  @objc dynamic var id: String = .default
  @objc dynamic var daysSinceLastExposure: Int = 0
  @objc dynamic var sequenceNumberInDay: Int = 0
  @objc dynamic var startOfDateReceived: Int = 0
  @objc dynamic var timezoneOffset: Int = 0
  @objc dynamic var matchedKeyCount: UInt64 = 0
  dynamic var attenuationDuration: AttenuationDuration = AttenuationDuration()
  @objc dynamic var maximumRiskScore: UInt8 = 0
  @objc dynamic var riskScoreSumFullRange: Double = 0.0

  init(_ enExposureDetectionSummary: ENExposureDetectionSummary) {
    timezoneOffset = TimeZone.current.secondsFromGMT()
    attenuationDuration.low = Int(truncating: enExposureDetectionSummary.attenuationDurations[0])
    attenuationDuration.medium = Int(truncating: enExposureDetectionSummary.attenuationDurations[1])
    attenuationDuration.high = Int(truncating: enExposureDetectionSummary.attenuationDurations[2])
    daysSinceLastExposure = enExposureDetectionSummary.daysSinceLastExposure
    matchedKeyCount = enExposureDetectionSummary.matchedKeyCount
    maximumRiskScore = enExposureDetectionSummary.maximumRiskScore
    riskScoreSumFullRange = enExposureDetectionSummary.riskScoreSumFullRange
    startOfDateReceived = Date().startOfDay
    sequenceNumberInDay = BTSecureStorage.shared.sequenceInDayNumber(for: startOfDateReceived)
    id = "\(startOfDateReceived):\(sequenceNumberInDay)"
  }

  required init() {
    super.init()
  }

  override class func primaryKey() -> String? {
    "id"
  }

}

class IntObject: Object, Codable {
    dynamic var value = 0
}

