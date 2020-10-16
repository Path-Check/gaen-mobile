import Alamofire
import Foundation

@available(iOS 13.7, *)
enum DailySummariesConfigurationRequest: APIRequest {

  typealias ResponseType = DailySummariesConfiguration

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
