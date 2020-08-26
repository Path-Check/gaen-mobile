@objc enum DebugAction: Int {
  case fetchDiagnosisKeys,
  detectExposuresNow,
  simulateExposureDetectionError,
  simulateExposure,
  fetchExposures,
  resetExposures,
  toggleENAuthorization,
  showLastProcessedFilePath
}
