import UIKit
import ExposureNotification

class DiagnosisSubmission: Encodable {
  var regions: String = "US"
  var appPackageName: String = Bundle.main.bundleIdentifier!
  var platform: String = "IOS"
  var deviceVerificationPayload: Data
  var temporaryExposureKeys: [CodableDiagnosisKey]
  var verificationCode: String
  var testDate: Date
  
  init(verificationCode: String, testDate: Date, deviceVerificationPayload: Data, temporaryExposureKeys: [CodableDiagnosisKey]) {
    self.testDate = testDate
    self.verificationCode = verificationCode
    self.deviceVerificationPayload = deviceVerificationPayload
    self.temporaryExposureKeys = temporaryExposureKeys
  }
  
  enum CodingKeys: String, CodingKey {
    case regions
    case appPackageName
    case platform
    case deviceVerificationPayload
    case temporaryExposureKeys
    case verificationCode  = "verification_code"
    case testDate = "test_date"
  }
}

struct ExposureResponse: Decodable {
  var diagnosisKeys: [CodableDiagnosisKey]
}

struct CodableDiagnosisKey: Codable, Equatable {
  var key: Data
  var transmissionRiskLevel: ENRiskLevel
  var rollingStartNumber: ENIntervalNumber
  var rollingPeriod: ENIntervalNumber
}
