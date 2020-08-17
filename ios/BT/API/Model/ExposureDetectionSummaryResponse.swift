import Foundation

struct ExposureDetectionSummaryResponse: Codable {
  let Exposure_summary_refs: [UUID]
  let duration_seconds: Int
  let date_of_exposure: Date?
  let date_most_recent_exposure: Date?
}
