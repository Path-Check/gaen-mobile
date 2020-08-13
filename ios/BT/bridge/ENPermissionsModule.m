#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"
#import "ENBridgeConstants.h"

@interface ENPermissionsModule: NSObject <RCTBridgeModule>
@end

@implementation ENPermissionsModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestExposureNotificationAuthorization: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] requestExposureNotificationAuthorizationWithEnabled:YES callback:^(NSError * _Nullable error) {
    if (error) {
      callback(@[error]);
    } else {
      callback(@[GENERIC_SUCCESS]);
    }
  }];
}

RCT_EXPORT_METHOD(getCurrentENPermissionsStatus: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] getCurrentENPermissionsStatusWithCallback:^(NSString * _Nonnull authorizationState, NSString * _Nonnull enabledState) {
    callback(@[authorizationState, enabledState]);
  }];
}

@end
