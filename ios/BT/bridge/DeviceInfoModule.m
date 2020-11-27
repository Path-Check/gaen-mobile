#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface DeviceInfoModule: NSObject <RCTBridgeModule>
@end

@implementation DeviceInfoModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getApplicationName,
                 getApplicationNameWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *applicationName = [[[NSBundle mainBundle] infoDictionary] objectForKey:(NSString *)@"CFBundleDisplayName"];
  resolve(applicationName);
}

RCT_REMAP_METHOD(getBuildNumber,
                 getBuildNumberWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *buildNumber = [[[NSBundle mainBundle] infoDictionary] objectForKey:(NSString *)kCFBundleVersionKey];
  resolve(buildNumber);
}

RCT_REMAP_METHOD(getVersion,
                 getVersionWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  resolve(version);
}

@end
