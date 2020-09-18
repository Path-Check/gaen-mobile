import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class CheckInStatus: Object, Codable {
  @objc dynamic var id: String = .default
  @objc dynamic var date: Int = 0
  var feelingGood: Bool = false
  var symptoms: List<String> = List<String>()

  init(date: Int,
       feelingGood: Bool,
       symptoms: [String]) {
    self.date = date
    self.feelingGood = feelingGood
    let list = List<String>()
    list.append(objectsIn: symptoms)
    self.symptoms = list
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
      "posixDate": date,
      "feelingGood": feelingGood,
      "symptoms": Array(symptoms)
    ]
  }

}
