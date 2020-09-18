#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#import "BT-Swift.h"

@interface CheckInModule: NSObject <RCTBridgeModule>
@end

@implementation CheckInModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(saveCheckInStatus,
                 checkInStatus:(NSDictionary *)checkInStatus
                 saveCheckInStatusWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSInteger date = [RCTConvert NSInteger:checkInStatus[@"posixDate"]];
  BOOL feelingGood = [RCTConvert NSString:checkInStatus[@"feelingGood"]];
  NSArray *symptoms = [RCTConvert NSArray:checkInStatus[@"symptoms"]];

  CheckInStatus *status = [[CheckInStatus alloc] initWithDate:date feelingGood:feelingGood symptoms:symptoms];
  [[ExposureManager shared] saveCheckInStatus:status];

  resolve(nil);
}

RCT_REMAP_METHOD(getCheckInStatuses,
                 getCheckInStatusesWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSArray *checkInStatuses = [[ExposureManager shared] checkInStatuses];
  resolve(checkInStatuses);
}

@end
