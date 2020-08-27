import Alamofire
import ExposureNotification

enum ExposureDetectionSummaryListRequest: APIRequest {

  typealias ResponseType = ScoringServerResponse

  case post(ExposureDetectionSummary, [ExposureDetectionSummary])

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
    case .post(let newExposureDetectionSummary,
              let storedExposureDetectionSummaries):
      return [
        "newExposureSummary": [
          newExposureDetectionSummary.asJsonBody,
        ],
        "unusedExposureSummaries": storedExposureDetectionSummaries.map { $0.asJsonBody }
      ]
    }
  }
}

private extension ExposureDetectionSummary {

  var asJsonBody: JSONObject {
    return [
        "dateReceived": startOfDateReceived,
        "timeZoneOffset": timezoneOffset,
        "attenuationDuration": attenuationDuration,
        "matchedKeyCount": matchedKeyCount,
        "daysSinceLastExposure": daysSinceLastExposure,
        "maximumRiskScore": maximumRiskScore,
        "seqNoInDay": sequenceNumberInDay,
        "riskScoreSum": riskScoreSumFullRange
      ]
  }

}
