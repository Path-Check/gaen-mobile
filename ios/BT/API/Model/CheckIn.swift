import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class CheckIn: Object, Codable {
  @objc dynamic var date: Int = 0
  @objc dynamic var status: Int = 0

  init(date: Int,
       status: Int) {
    self.date = date
    self.status = status
    super.init()
  }

  required init() {
    super.init()
  }

  override class func primaryKey() -> String? {
    "date"
  }

  var asDictionary : [String: Any] {
    return [
      "date": date,
      "status": status
    ]
  }

}
