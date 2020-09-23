#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#import "BT-Swift.h"

@interface CheckInModule: NSObject <RCTBridgeModule>
@end

@implementation CheckInModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(addCheckIn,
                 checkIn:(NSDictionary *)checkIn
                 saveCheckInWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSInteger date = [RCTConvert NSInteger:checkIn[@"date"]];
  NSInteger status = [RCTConvert NSInteger:checkIn[@"status"]];

  CheckIn *checkInModel = [[CheckIn alloc] initWithDate:date status:status];
  [[ExposureManager shared] saveCheckIn:checkInModel];

  resolve(nil);
}

RCT_REMAP_METHOD(getCheckIns,
                 getCheckInsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSArray *checkInStatuses = [[ExposureManager shared] checkIns];
  resolve(checkInStatuses);
}

@end
