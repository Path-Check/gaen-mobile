#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface DebugMenuModule: NSObject <RCTBridgeModule>
@end

@implementation DebugMenuModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(fetchDiagnosisKeys,
                 fetchDiagnosisKeysWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionFetchDiagnosisKeys resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(forceAppCrash)
{
  @throw [NSException exceptionWithName:NSGenericException reason:@"Forced Crash (Debug)" userInfo:nil];
}

RCT_REMAP_METHOD(fetchDebugLog,
                 fetchDebugLogWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionFetchDebugLog resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(detectExposuresNow,
                 detectExposuresNowWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionDetectExposuresNow resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(simulateExposureDetectionError,
                 simulateExposureDetectionErrorWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposureDetectionError resolve:resolve reject:reject];

}

RCT_REMAP_METHOD(simulateExposure,
                 simulateExposureWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposure resolve:resolve reject:reject];
}


RCT_REMAP_METHOD(fetchExposures,
                 fetchExposuresWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposure resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(toggleExposureNotifications,
                 toggleExposureNotificationsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionToggleENAuthorization resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(resetExposures,
                 resetExposuresWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionResetExposures resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(showLastProcessedFilePath,
                 showLastProcessedFilePathResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionShowLastProcessedFilePath resolve:resolve reject:reject];
}

@end
