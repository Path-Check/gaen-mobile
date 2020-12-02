#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"
#import "ENBridgeConstants.h"

@interface UABKeySubmissionModule: NSObject <RCTBridgeModule>
@end

@implementation UABKeySubmissionModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(submitPhoneNumber,
                 phoneNumber: (NSString *)phoneNumber
                 submitPhoneNumberWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[UABManager shared] submitPhoneNumberWithPhoneNumber:phoneNumber
                                      completionHandler:^(NSError * _Nullable error) {
    if (error) {
      reject(error.domain,
             error.localizedDescription,
             error);
    } else {
      resolve(nil);
    }
  }];
}

RCT_REMAP_METHOD(submitDiagnosisKeys,
                 verificationCode: (NSString *)verificationCode
                 date: (NSDate *)date
                 submitDiagnosisKeysWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[UABManager shared] submitDiagnosisKeys:verificationCode date:date completionHandler:^(NSError * _Nullable error) {
    if (error) {
      reject(error.domain,
             error.localizedDescription,
             error);
    } else {
      resolve(nil);
    }
  }];
}

@end
