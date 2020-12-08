extension Notification.Name {
  public static let StorageTestResultsDidChange = Notification.Name(rawValue: "BTSecureStorageTestResultsDidChange")
  public static let StorageExposureDetectionErrorLocalizedDescriptionDidChange = Notification.Name(rawValue: "BTSecureStorageExposureDetectionErrorLocalizedDescriptionDidChange")
  public static let dateLastPerformedFileCapacityResetDidChange = Notification.Name(rawValue: "BTSecureStorageDateLastPerformedExposureDetectionDidChange")
  public static let lastExposureCheckDateDidChange = Notification.Name(rawValue: "BTSecureStorageLastExposureCheckDatenDidChange")

  public static let HMACKeyDidChange = Notification.Name(rawValue: "BTSecureStorageHMACKeyDidChange")
  public static let revisionTokenDidChange = Notification.Name(rawValue: "onRevisionTokenDidChange")
  public static let ExposuresDidChange = Notification.Name(rawValue: "onExposureRecordUpdated")
  public static let ExposureNotificationStatusDidChange = Notification.Name(rawValue: "onEnabledStatusUpdated")
  public static let remainingDailyFileProcessingCapacityDidChange = Notification.Name(rawValue: "remainingDailyFileProcessingCapacityDidChange")
  public static let UrlOfMostRecentlyDetectedKeyFileDidChange = Notification.Name(rawValue: "UrlOfMostRecentlyDetectedKeyFileDidChange")
}

extension Notification {

  public enum UserInfoKey {
    public static let enabledState = "enabledState"
    public static let authorizationState = "authorizationState"
  }

}

