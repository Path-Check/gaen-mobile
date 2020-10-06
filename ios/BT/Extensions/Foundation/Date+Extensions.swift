extension Date {
  var posixRepresentation: Int {
    Int(timeIntervalSince1970) * 1000
  }
  
  static func hourDifference(from startDate: Date, to endDate: Date) -> Int {
    Calendar.current.dateComponents([.hour], from: startDate, to: endDate).hour ?? 0
  }

  static func daysAgoInPosix(_ days: Int) -> Int {
    return Calendar.current.date(byAdding: DateComponents(day: -1 * days), to: Date())!.posixRepresentation
  }
}
