import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class Exposure: Object, Codable {
  @objc dynamic var id: String = .default
  @objc dynamic var date: Int = 0
  @objc dynamic var duration: Double = 0.0
  @objc dynamic var totalRiskScore: Int = 0
  @objc dynamic var transmissionRiskLevel: Int = 0

  init(id: String,
       date: Int) {
    self.id = id
    self.date = date
    super.init()
  }

  required init() {
    super.init()
  }

  override class func primaryKey() -> String? {
    "id"
  }

  var asDictionary : [String: Any] {
    return [
      "id": id,
      "date": date,
      "duration": duration,
      "totalRiskScore": totalRiskScore,
      "transmissionRiskLevel": transmissionRiskLevel
    ]
  }

}
