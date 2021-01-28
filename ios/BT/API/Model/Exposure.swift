import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class Exposure: Object, Codable {
  @objc dynamic var id: String = .default
  @objc dynamic var date: Int = 0
  @objc dynamic var weightedDurationSum: Double = 0

  init(id: String,
       date: Int,
       weightedDurationSum: Double) {
    self.id = id
    self.date = date
    self.weightedDurationSum = weightedDurationSum
    super.init()
  }

  required override init() {
    super.init()
  }

  override class func primaryKey() -> String? {
    "id"
  }

  var asDictionary : [String: Any] {
    return [
      "id": id,
      "date": date,
      "weightedDurationSum": weightedDurationSum
    ]
  }

}
