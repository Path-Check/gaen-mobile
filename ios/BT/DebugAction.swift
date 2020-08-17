@objc enum DebugAction: Int {
  case fetchDiagnosisKeys,
  detectExposuresNow,
  simulateExposureDetectionError,
  simulateExposure,
  fetchExposures,
  getAndPostDiagnosisKeys,
  toggleENAuthorization,
  showLastProcessedFilePath
}
