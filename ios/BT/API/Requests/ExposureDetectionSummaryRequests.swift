import Alamofire
import ExposureNotification

enum ExposureDetectionSummaryListRequest: APIRequest {

  typealias ResponseType = ExposureDetectionSummaryResponse

  case put(ExposureDetectionSummary, [ExposureDetectionSummary])

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
    case .put(let newExposureDetectionSummary,
              let storedExposureDetectionSummaries):
      return [
        "new_exposure_summary": [
          newExposureDetectionSummary.asJsonBody,
        ],
        "unused_exposure_summaries": storedExposureDetectionSummaries.map { $0.asJsonBody }
      ]
    }
  }
}

private extension ExposureDetectionSummary {

  var asJsonBody: JSONObject {
    return [
        "date_received": startOfDateReceived,
        "timezone_offset": timezoneOffset,
        "attenuation_durations_seconds": [],
        "matched_key_count": matchedKeyCount,
        "days_since_last_exposure": daysSinceLastExposure,
        "maximum_risk_score": maximumRiskScore,
        "seq_no_in_day": sequenceNumberInDay,
        "risk_score_sum": riskScoreSumFullRange
      ]
  }

}
