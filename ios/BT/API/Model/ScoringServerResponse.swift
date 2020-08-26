import Foundation

struct ScoringServerResponse: Codable {
  let notifications: [ExposureNotification]
}
