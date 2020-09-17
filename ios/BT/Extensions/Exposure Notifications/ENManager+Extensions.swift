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
  @discardableResult func detectExposures(configuration: ENExposureConfiguration,
                                          diagnosisKeyURLs: [URL],
                                          completionHandler: @escaping ENDetectExposuresHandler) -> Progress
  @available(iOS 13.7, *)
  @discardableResult func detectExposures(configuration: ENExposureConfiguration,
                                          completionHandler: @escaping ENDetectExposuresHandler) -> Progress
  @discardableResult func getExposureInfo(summary: ENExposureDetectionSummary,
                                          userExplanation: String,
                                          completionHandler: @escaping ENGetExposureInfoHandler) -> Progress
  @available(iOS 13.7, *)
  @discardableResult func getExposureWindows(summary: ENExposureDetectionSummary,
                               completionHandler: @escaping ENGetExposureWindowsHandler) -> Progress
  func getDiagnosisKeys(completionHandler: @escaping ENGetDiagnosisKeysHandler)
  func getTestDiagnosisKeys(completionHandler: @escaping ENGetDiagnosisKeysHandler)
}

extension ENManager: ExposureNotificationManager {

  func authorizationStatus() -> ENAuthorizationStatus {
    if #available(iOS 14, *) {
      // On iOS 14, authorization status appears to be incorrectly reported
      // when first being authorized, and only returns the accurate value
      // after force quitting and re-launching the app, so we coalesce here
      // based on exposureNotificationStatus instead
      return exposureNotificationStatus == .active ? .authorized : .notAuthorized
    }
    return ENManager.authorizationStatus
  }
}
