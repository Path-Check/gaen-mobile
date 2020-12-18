import Foundation

extension String {

  static let `default` = ""

  // API
  static let revisionToken = "revisionToken"

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
  static let keyPathLastExposureCheckDate = "lastExposureCheckDate"
  static let keyPathExposures = "exposures"
  static let keyPathHMACKey = "HMACKey"

  // .env
  static let postKeysUrl = "POST_DIAGNOSIS_KEYS_URL"
  static let downloadBaseUrl = "DOWNLOAD_BASE_URL"
  static let exposureConfigurationUrlV1 = "APPLE_EN_CONFIG_URL_V1"
  static let exposureConfigurationUrlV2 = "APPLE_EN_CONFIG_URL_V2"
  static let downloadPath = "DOWNLOAD_PATH"
  static let hmackey = "HMAC_KEY"
  static let regionCodes = "REGION_CODES"
  static let dev = "DEV"

  // Notifications
  static let bluetoothNotificationTitle = "Bluetooth Off"
  static let bluetoothNotificationBody = "You must enable bluetooth to receive Exposure Notifications."
  static let bluetoothNotificationIdentifier = "bluetooth-off"
  static let exposureDetectionErrorNotificationTitle = "Error Detecting Exposures"
  static let exposureDetectionErrorNotificationBody = "An error occurred while attempting to detect exposures."
  static let newExposureNotificationIdentifier = "new-exposure-notification"
  static let newExposureNotificationTitle = "Possible COVID-19 Exposure"
  static let newExposureNotificationBody = "Someone you were near recently has been diagnosed with COVID-19. Tap for more details."
  static let exposureDetectionErrorNotificationIdentifier = "expososure-notification-error"
  static let notificationUrlKey = "url"
  static let notificationUrlBasePath = "pathcheck://"
  static let notificationUrlExposureHistoryPath = "exposureHistory"

  // JS Layer
  static let genericSuccess = "success"
  
  // Error Messages
  static let cannotEnableNotifications = "Error enabling notifications"
  static let noLocalKeysFound = "No exposure keys on device, please try again in 60 minutes"
  static let noLastResetDateAvailable = "No lastResetDate available"
  static let emptyMessageError = ""
  static let dailyFileProcessingLimitExceeded = "Daily exposure detection file processing limit exceeded"
  static let exposureDetectionCanceled = "Exposure Detection Cancelled"
  
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
