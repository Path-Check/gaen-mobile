import Alamofire
import Foundation

enum ExposureConfigurationV1Request: APIRequest {

  typealias ResponseType = ExposureConfigurationV1

  case get

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    }
  }

  var path: String {
    switch self {
    case .get:
      return .default
    }
  }

}
