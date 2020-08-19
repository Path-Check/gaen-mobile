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
  [[ExposureManager shared] requestExposureNotificationAuthorizationWithEnabled:YES
                                                                       callback:^(ExposureManagerError * _Nullable error) {
    if (error) {
      reject(error.errorCode, error.localizedMessage, error.underlyingError);
    } else {
      resolve(@[GENERIC_SUCCESS]);
    }
  }];
}

RCT_REMAP_METHOD(getCurrentENPermissionsStatus,
                 getCurrentENPermissionsStatusWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [[ExposureManager shared] getCurrentENPermissionsStatusWithCallback:^(NSString * _Nonnull authorizationState,
                                                                        NSString * _Nonnull enabledState) {
    resolve(@[authorizationState, enabledState]);
  }];
}

@end
