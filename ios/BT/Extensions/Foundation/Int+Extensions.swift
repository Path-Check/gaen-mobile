extension Int {

  var fromPosixRepresentation: Date {
    Date(timeIntervalSince1970: TimeInterval(self / 1000))
  }

}
