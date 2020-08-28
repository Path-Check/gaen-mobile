#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"
#import "ENBridgeConstants.h"

@interface ExposureKeyModule: NSObject <RCTBridgeModule>
@end

@implementation ExposureKeyModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(fetchExposureKeys,
                 fetchExposureKeysWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] fetchExposureKeysWithCallback:^(NSArray<NSDictionary<NSString *,id> *> * _Nullable keys,
                                                            ExposureManagerError * _Nullable error) {
    if (error) {
      reject(error.errorCode,
             error.localizedMessage,
             error.underlyingError);
    } else {
      resolve(keys);
    }
  }];
}

RCT_REMAP_METHOD(storeRevisionToken,
                 revisionToken: (NSString *)revisionToken
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[DefaultKeychainService shared] setRevisionToken:revisionToken];
  resolve(nil);
}

RCT_REMAP_METHOD(getRevisionToken,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *revisionToken = [[DefaultKeychainService shared] revisionToken];
  resolve(revisionToken);
}


@end
