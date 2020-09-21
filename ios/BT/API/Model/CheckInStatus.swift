import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class CheckInStatus: Object, Codable {
  @objc dynamic var id: String = .default
  @objc dynamic var date: Int = 0
  var feelingGood: Int = 0
  var symptoms: List<String> = List<String>()

  init(date: Int,
       feelingGood: Int,
       symptoms: [String]) {
    self.id = UUID().uuidString
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
    "id"
  }

  var asDictionary : [String: Any] {
    return [
      "id": id,
      "posixDate": date,
      "feelingGood": feelingGood,
      "symptoms": Array(symptoms)
    ]
  }

}
