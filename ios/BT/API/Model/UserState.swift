import Foundation
import RealmSwift

@objcMembers
class UserState: Object {
  static let id = 0

  @objc dynamic var id: Int = UserState.id
  @objc dynamic var dateLastPerformedFileCapacityReset: Date? = nil
  @objc dynamic var remainingDailyFileProcessingCapacity: Int = Constants.dailyFileProcessingCapacity
  @objc dynamic var exposureDetectionErrorLocalizedDescription: String = .default
  @objc dynamic var urlOfMostRecentlyDetectedKeyFile: String = .default
  let exposures: List<Exposure> = List<Exposure>()

  override class func primaryKey() -> String? {
    "id"
  }

  var recentExposures: [Exposure] {
    let dateCutoff = Calendar.current.date(
      byAdding: .hour,
      value: -350,
      to: Date())!
    let allExposures: [Exposure] = Array(exposures)
    return allExposures.filter { (exposure: Exposure) in
      return exposure.date.fromPosixRepresentation > dateCutoff
    }
  }

}
