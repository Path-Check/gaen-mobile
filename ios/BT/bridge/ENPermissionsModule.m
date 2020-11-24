#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"
#import "ENBridgeConstants.h"

@interface ENPermissionsModule: NSObject <RCTBridgeModule>
@end

@implementation ENPermissionsModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(requestExposureNotificationAuthorization,
                 requestExposureNotificationAuthorizationWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  [[ExposureManager shared] requestExposureNotificationAuthorizationWithResolve:resolve reject:reject];
}

RCT_REMAP_METHOD(getCurrentENPermissionsStatus,
                 getCurrentENPermissionsStatusWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [[ExposureManager shared] getCurrentENPermissionsStatusWithCallback:^(NSString * _Nonnull exposureNotificationStatus) {
    resolve(exposureNotificationStatus);
  }];
}

@end
