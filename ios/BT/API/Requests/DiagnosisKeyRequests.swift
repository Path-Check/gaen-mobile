import Alamofire
import ExposureNotification

enum DiagnosisKeyRequest: APIRequest {

  typealias ResponseType = ExposureKey

  case get(URL),
  delete(URL)

  var method: HTTPMethod {
    switch self {
    case .get:
      return .get
    case .delete:
      return .delete
    }
  }

  var path: String {
    return ""
  }

  var parameters: Parameters? {
    return nil
  }

}

enum DiagnosisKeyListRequest: APIRequest {

  typealias ResponseType = Void

  case post([ExposureKey], [RegionCode], String, String)

  var method: HTTPMethod {
    switch self {
    case .post:
      return .post
    }
  }

  var path: String {
    switch self {
    case .post:
      return ""
    }
  }

  var parameters: Parameters? {
    switch self {
    case .post(let diagnosisKeys,
               let regions,
               let certificate,
               let hmacKey):
               let keys = diagnosisKeys.map { try? $0.toJson() as? JSONObject }
      return [
        "temporaryExposureKeys": keys,
        "regions": regions.map { $0 },
        "appPackageName": Bundle.main.bundleIdentifier!,
        "verificationPayload": certificate,
        "hmackey": hmacKey,
        "padding": Data.randomPadding(size: 1000)
      ]
    }
  }
}

private extension Data {

  static func randomPadding(size: Int) -> String {
    let bytes = [UInt32](repeating: 0, count: size).map { _ in arc4random() }
    let data = Data(bytes: bytes, count: size)
    return data.base64EncodedString()
  }

}
