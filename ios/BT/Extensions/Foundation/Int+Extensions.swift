extension Int {

  var fromPosixRepresentation: Date {
    Date(timeIntervalSince1970: TimeInterval(self / 1000))
  }

  var enErrorString: String {
    switch self {
    case 1:
      return "IOSUnknown"
    case 2:
      return "BadParameter"
    case 3:
      return "NotEntitled"
    case 4:
      return "NotAuthorized"
    case 5:
      return "Unsupported"
    case 6:
      return "Invalidated"
    case 7:
      return "BluetoothOff"
    case 8:
      return "InsufficientStorage"
    case 9:
      return "NotEnabled"
    case 10:
      return "APIMisuse"
    case 11:
      return "Internal"
    case 12:
      return "InsufficientMemory"
    case 13:
      return "RateLimited"
    case 14:
      return "Restricted"
    case 15:
      return "BadFormat"
    case 16:
      return "DataInaccessible"
    case 17:
      return "TravelStatusNotAvailable"
    default:
      return "Unknown"
    }
  }

}
