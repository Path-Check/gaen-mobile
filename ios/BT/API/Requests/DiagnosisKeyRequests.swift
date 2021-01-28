import Alamofire
import ExposureNotification

enum DiagnosisKeyRequest: APIRequest {

  typealias ResponseType = ExposureKey

  case get(URL)

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    }
  }

  var path: String {
    return String.default
  }

  var parameters: Parameters? {
    return nil
  }

}
