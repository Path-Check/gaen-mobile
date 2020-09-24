import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class SymptomLogEntry: Object, Codable {
  @objc dynamic var id: String = .default
  @objc dynamic var date: Int = 0
  dynamic var symptoms: List<String> = List<String>()

  init(id: String?,
       date: Int,
       symptoms: [String]) {
    self.id = id ?? UUID().uuidString
    self.date = date
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
      "date": date,
      "symptoms": Array(symptoms)
    ]
  }

}

