#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>
#import "BT-Swift.h"

@interface SymptomLogEntryModule: NSObject <RCTBridgeModule>
@end

@implementation SymptomLogEntryModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(addSymptomLogEntry,
                 symptomLogEntry:(NSDictionary *)symptomLogEntry
                 saveSymptomLogEntryWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSInteger date = [RCTConvert NSInteger:symptomLogEntry[@"date"]];
  NSArray *symptoms = [RCTConvert NSArray:symptomLogEntry[@"symptoms"]];

  SymptomLogEntry *entry = [[SymptomLogEntry alloc] initWithId:nil date:date symptoms:symptoms];
  [[ExposureManager shared] saveSymptomLogEntry:entry];

  resolve(nil);
}

RCT_REMAP_METHOD(updateSymptomLogEntry,
                 symptomLogEntry:(NSDictionary *)symptomLogEntry
                 updateSymptomLogEntryWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *indentifier = [RCTConvert NSString:symptomLogEntry[@"id"]];
  NSInteger date = [RCTConvert NSInteger:symptomLogEntry[@"date"]];
  NSArray *symptoms = [RCTConvert NSArray:symptomLogEntry[@"symptoms"]];

  SymptomLogEntry *entry = [[SymptomLogEntry alloc] initWithId:indentifier date:date symptoms:symptoms];
  [[ExposureManager shared] saveSymptomLogEntry:entry];

  resolve(nil);
}

RCT_REMAP_METHOD(deleteSymptomLogEntry,
                 symptomLogEntryId:(NSString *)symptomLogEntryId
                 deleteSymptomLogEntrySymptomLogEntryWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] deleteSymptomLogEntry:symptomLogEntryId];
  resolve(nil);
}

RCT_REMAP_METHOD(deleteSymptomLogs,
                 deleteSymptomLogsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] deleteSymptomLogEntries];
  resolve(nil);
}

RCT_REMAP_METHOD(deleteSymptomLogsOlderThan,
                 days:(NSInteger)days
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] deleteSymptomLogsOlderThan:days];
  resolve(nil);
}

RCT_REMAP_METHOD(getSymptomLogEntries,
                 getSymptomLogEntriesWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSArray *symptomLogEntries = [[ExposureManager shared] symptomLogEntries];
  resolve(symptomLogEntries);
}

@end
