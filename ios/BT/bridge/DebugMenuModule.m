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

RCT_REMAP_METHOD(addOldExposure,
                 addOldExposureResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionAddOldExposure resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(configureFasterChaffForTesting,
                 configureFasterChaffForTestingResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionConfigureFasterChaffForTesting resolve:resolve reject:reject];
}

@end
