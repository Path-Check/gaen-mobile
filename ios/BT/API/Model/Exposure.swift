import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class Exposure: Object, Codable {
  @objc dynamic var id: String = .default
  @objc dynamic var date: Int = 0

  init(id: String,
       date: Int) {
    self.id = id
    self.date = date
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
      "date": date
    ]
  }

}
