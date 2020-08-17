import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class ExposureDetectionSummary: Object, Codable {
  @objc dynamic var id: String = .default
  @objc dynamic var daysSinceLastExposure: Int = 0
  @objc dynamic var dateReceived: Int = 0
  @objc dynamic var timezoneOffset: Int = 0
  @objc dynamic var sequenceNumberInDay: Int = 0
  @objc dynamic var matchedKeyCount: UInt64 = 0
  dynamic var attenuationDurations: List<IntObject> = List<IntObject>()
  @objc dynamic var maximumRiskScore: UInt8 = 0
  @objc dynamic var riskScoreSumFullRange: Double = 0.0

  init(_ enExposureDetectionSummary: ENExposureDetectionSummary) {
    dateReceived = Date().posixRepresentation
    timezoneOffset = TimeZone.current.secondsFromGMT()
    attenuationDurations.append(objectsIn: enExposureDetectionSummary.attenuationDurations.map { IntObject(value: Int(truncating: $0)) })
    daysSinceLastExposure = enExposureDetectionSummary.daysSinceLastExposure
    matchedKeyCount = enExposureDetectionSummary.matchedKeyCount
    maximumRiskScore = enExposureDetectionSummary.maximumRiskScore
    riskScoreSumFullRange = enExposureDetectionSummary.riskScoreSumFullRange
    id = "\(dateReceived)"
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

