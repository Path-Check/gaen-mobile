import ExposureNotification

/// This protocol is meant to be a wrapper to make the manager class testeable
protocol ExposureNotificationManager {
  var dispatchQueue: DispatchQueue { get }
  var exposureNotificationStatus: ENStatus { get }
  var invalidationHandler: (() -> Void)? { get }
  func activate(completionHandler: @escaping ENErrorHandler)
  func invalidate()

  func authorizationStatus() -> ENAuthorizationStatus

  var exposureNotificationEnabled: Bool { get }
  func setExposureNotificationEnabled(_ enabled: Bool, completionHandler: @escaping ENErrorHandler)
  func detectExposures(configuration: ENExposureConfiguration, diagnosisKeyURLs: [URL], completionHandler: @escaping ENDetectExposuresHandler) -> Progress
  @discardableResult func getExposureInfo(summary: ENExposureDetectionSummary, userExplanation: String, completionHandler: @escaping ENGetExposureInfoHandler) -> Progress
  func getDiagnosisKeys(completionHandler: @escaping ENGetDiagnosisKeysHandler)
  func getTestDiagnosisKeys(completionHandler: @escaping ENGetDiagnosisKeysHandler)
}

extension ENManager: ExposureNotificationManager {

  func authorizationStatus() -> ENAuthorizationStatus {
    return ENManager.authorizationStatus
  }
}
