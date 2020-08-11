import Foundation

extension String {

  static let `default` = ""

  // EN
  static let notAuthorized = "notAuthorized"
  static let authorized = "authorized"

  // Realm
  static let remainingDailyFileProcessingCapacity = "remainingDailyFileProcessingCapacity"
  static let urlOfMostRecentlyDetectedKeyFile = "urlOfMostRecentlyDetectedKeyFile"

  // Persisted
  static let keyPathTestResults = "testResults"
  static let keyPathExposureDetectionErrorLocalizedDescription = "exposureDetectionErrorLocalizedDescription"
  static let keyPathdateLastPerformedFileCapacityReset = "dateLastPerformedFileCapacityReset"
  static let keyPathExposures = "exposures"
  static let keyPathHMACKey = "HMACKey"

  // .env
  static let postKeysUrl = "POST_DIAGNOSIS_KEYS_URL"
  static let downloadBaseUrl = "DOWNLOAD_BASE_URL"
  static let exposureConfigurationUrl = "EXPOSURE_CONFIGURATION_URL"
  static let downloadPath = "DOWNLOAD_PATH"
  static let hmackey = "HMAC_KEY"
  static let regionCodes = "REGION_CODES"

  // Notifications
  static let bluetoothNotificationTitle = "Bluetooth Off"
  static let bluetoothNotificationBody = "You must enable bluetooth to receive Exposure Notifications."
  static let bluetoothNotificationIdentifier = "bluetooth-off"
  static let exposureDetectionErrorNotificationTitle = "Error Detecting Exposures"
  static let exposureDetectionErrorNotificationBody = "An error occurred while attempting to detect exposures."
  static let newExposureNotificationTitle = "Possible COVID-19 Exposure"
  static let newExposureNotificationBody = "Someone you were near recently has been diagnosed with COVID-19. Tap for more details."
  static let exposureDetectionErrorNotificationIdentifier = "expososure-notification-error"

  // JS Layer
  static let genericSuccess = "success"
  
  // ErrorCodes
  static let networkFailure = "network_request_error"
  static let noExposureKeysFound = "no_exposure_keys_found"
  static let detectionNeverPerformed = "no_last_detection_date"

  // Error Messages
  static let noLocalKeysFound = "No exposure keys on device, please try again in 60 minutes"

  // Computed Properties
  var gaenFilePaths: [String] {
    split(separator: "\n").map { String($0) }
  }

  var localized: String {
    NSLocalizedString(self, comment: .default)
  }

  var regionCodes: [RegionCode] {
    self.split(separator: "|").map { String($0) }
  }

}
