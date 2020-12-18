import ExposureNotification
import Foundation
import XCTest

@testable import BT

extension XCTestCase {

  static var halloween: Date {
    var components = DateComponents()
    components.year = 2019
    components.month = 10
    components.day = 31
    let date = Calendar.current.date(from: components)
    return date!
  }

  static var startOfDay: Date {
    return Calendar.current.startOfDay(for: Date())
  }

  
  func defaultStorage() -> BTSecureStorageMock {
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter())
    btSecureStorageMock.userStateHandler = {
      let userState = UserState()
      userState.exposures.append(Exposure(id: "1",
                                          date: XCTestCase.startOfDay.posixRepresentation,
                                          weightedDurationSum: 2000))
      return userState
    }
    return btSecureStorageMock
  }
  
  func defaultExposureManager(withKeys: Bool = true, enAPIVersion: ENAPIVersion,
                              userState: UserState? = nil,
                              forceRiskScore: RiskScore = .aboveThreshold,
                              forceExposureDetectionError: Bool = false,
                              forceDownloadKeyError: Bool = false,
                              forceKeyUnpackingError: Bool = false,
                              forceGetExposureInfoError: Bool = false,
                              forceDownloadConfigurationError: Bool = false) -> ExposureManager {
    
    let btSecureStorageMock = BTSecureStorageMock(notificationCenter: NotificationCenter.default)
    
    var apiClientMock: APIClientMock!
    var enManagerMock: ENManagerMock!
    
    
    if enAPIVersion == .v2, #available(iOS 13.7, *) {
      apiClientMock = apiClientV2(forceDownloadKeyError: forceDownloadKeyError,
                                  forceKeyUnpackingError: forceKeyUnpackingError,
                                  forceDownloadConfigurationError: forceDownloadConfigurationError)
      enManagerMock = eNManagerMockV2(forceExposureDetectionError: forceExposureDetectionError,
                                      forceRiskScore: forceRiskScore)
    } else {
      apiClientMock = apiClientV1(forceDownloadKeyError: forceDownloadKeyError,
                                  forceKeyUnpackingError: forceKeyUnpackingError,
                                  forceDownloadConfigurationError: forceDownloadConfigurationError)
      enManagerMock = eNManagerMockV1(forceExposureDetectionError: forceExposureDetectionError,
                                      forceGetExposureInfoError: forceGetExposureInfoError)
    }
    
    if let userState = userState {
      btSecureStorageMock.userStateHandler = {
        return userState
      }
    }
    
    if withKeys {
      enManagerMock.getDiagnosisKeysHandler = { callback in
        callback([ENTemporaryExposureKey()], nil)
      }
    } else {
      enManagerMock.getDiagnosisKeysHandler = { callback in
        callback(nil, GenericError.unknown)
      }
    }
    
    let exposureManager = ExposureManager(exposureNotificationManager: enManagerMock,
                                          apiClient: apiClientMock,
                                          btSecureStorage: btSecureStorageMock)
    return exposureManager
  }
  
  func eNManagerMockV1(forceExposureDetectionError: Bool,
                       forceGetExposureInfoError: Bool) -> ENManagerMock {
    let enManagerMock = ENManagerMock()
    
    enManagerMock.enDetectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
      let enExposureSummary = MockENExposureDetectionSummary()
      enExposureSummary.matchedKeyCountHandler = {
        return 1
      }
      enExposureSummary.attenuationDurationsHandler = {
        return [900,0,0]
      }
      
      if forceExposureDetectionError {
        completionHandler(nil, GenericError.unknown)
      } else {
        completionHandler(enExposureSummary, nil)
      }
      return Progress()
    }
    
    enManagerMock.getExposureInfoHandler = { summary, useExplanation, completionHandler in
      guard !forceGetExposureInfoError else {
        completionHandler(nil, GenericError.unknown)
        return Progress()
      }
      completionHandler([MockENExposureInfo()], nil)
      return Progress()
    }
    
    return enManagerMock
  }
  
  @available(iOS 13.7, *)
  func eNManagerMockV2(forceExposureDetectionError: Bool = false, forceRiskScore: RiskScore) -> ENManagerMock {
    let enManagerMock = ENManagerMock()
    
    let mockDaySummariesENExposureDetectionSummary = MockDaySummariesENExposureDetectionSummary()
    
    let enExposureSummaryItemMock = MockENExposureSummaryItem()
    enExposureSummaryItemMock.weightedDurationSumHandler = {
      return forceRiskScore == .aboveThreshold ? 1200 : 0 // 20 minutes : 0 minutes
    }
    
    let enExposureDaySummaryMock = MockENExposureDaySummary()
    enExposureDaySummaryMock.daySummaryHandler = {
      return enExposureSummaryItemMock
    }
    
    mockDaySummariesENExposureDetectionSummary.daySummariesHandler = {
      return [enExposureDaySummaryMock]
    }
    
    enManagerMock.enDetectExposuresHandler = { configuration, diagnosisKeys, completionHandler in
      if forceExposureDetectionError {
        completionHandler(nil, GenericError.unknown)
      } else {
        completionHandler(mockDaySummariesENExposureDetectionSummary, nil)
      }
      return Progress()
    }
    
    return enManagerMock
  }
  
  func apiClientV1(forceDownloadKeyError: Bool,
                   forceKeyUnpackingError: Bool,
                   forceDownloadConfigurationError: Bool) -> APIClientMock {
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      return GenericResult<String>.success("indexFilePath") as AnyObject
    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      guard !forceKeyUnpackingError else {
        throw GenericError.unknown
      }
      return URL(fileURLWithPath: "url")
    }
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        return forceDownloadKeyError ? .failure(GenericError.unknown) : GenericResult<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return forceDownloadConfigurationError ? .failure(GenericError.unknown) : GenericResult<ExposureConfigurationV1>.success(ExposureConfigurationV1.placeholder)
      }
    }
    return apiClientMock
  }
  
  @available(iOS 13.7, *)
  func apiClientV2(forceDownloadKeyError: Bool,
                   forceKeyUnpackingError: Bool,
                   forceDownloadConfigurationError: Bool) -> APIClientMock {
    let apiClientMock = APIClientMock { (request, requestType) -> (AnyObject) in
      return GenericResult<String>.success("indexFilePath") as AnyObject
    }
    let mockDownloadedPackage = MockDownloadedPackage { () -> URL in
      guard !forceKeyUnpackingError else {
        throw GenericError.unknown
      }
      return URL(fileURLWithPath: "url")
    }
    
    apiClientMock.downloadRequestHander = { (request, requestType) in
      switch requestType {
      case .downloadKeys:
        return forceDownloadKeyError ? .failure(GenericError.unknown) : GenericResult<DownloadedPackage>.success(mockDownloadedPackage)
      default:
        return forceDownloadConfigurationError ? .failure(GenericError.unknown) : GenericResult<DailySummariesConfiguration>.success(DailySummariesConfiguration.placeholder)
      }
    }
    return apiClientMock
  }
  
}

enum RiskScore {
  case aboveThreshold, belowThreshold
}

enum ENAPIVersion {
  case v1, v2
}
