import Alamofire
import ExposureNotification

enum KeyArchiveRequest: APIRequest {

  typealias ResponseType = DownloadedPackage

  case get(String)

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    }
  }

  var path: String {
    switch self {
    case .get(let path):
      return path
    }
  }

  var parameters: Parameters? {
    return nil
  }

}
