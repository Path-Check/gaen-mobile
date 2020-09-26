#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface ExposureHistoryModule: NSObject <RCTBridgeModule>
@end

@implementation ExposureHistoryModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getCurrentExposures,
                 getCurrentExposuresWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  resolve([[ExposureManager shared] currentExposures]);
}

RCT_REMAP_METHOD(fetchLastDetectionDate,
                 fetchLastDetectionDateWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] fetchLastDetectionDateWithCallback:^(NSNumber * _Nullable posixRepresentation, ExposureManagerError * _Nullable error) {
    if (error) {
      reject(error.errorCode, error.localizedMessage, error.underlyingError);
    } else {
      resolve(posixRepresentation);
    }
  }];
}

RCT_REMAP_METHOD(detectExposures,
                 detectExposuresWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] detectExposuresWithResolve:resolve reject:reject];
}

@end
