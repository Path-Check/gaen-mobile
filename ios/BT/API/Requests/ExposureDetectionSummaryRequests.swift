import Alamofire
import ExposureNotification

enum ExposureDetectionSummaryListRequest: APIRequest {

  typealias ResponseType = ExposureDetectionSummaryResponse

  case put([ExposureDetectionSummary])

  var method: HTTPMethod {
    switch self {
    case .put:
      return .put
    }
  }

  var path: String {
    switch self {
    case .put:
      return ""
    }
  }

  var parameters: Parameters? {
    switch self {
    case .put(let exposureDetectionSummary):
      return [
        "exposure_summaries": [
          "date_received": "",
          "timezone_offset": 0,
          "attenuation_durations_seconds": [],
          "matched_key_count": 0,
          "days_since_last_exposure": 0,
          "maximum_risk_score": 0,
          "risk_score_sum": 0
        ]
      ]
    }
  }
}
