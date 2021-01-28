//
//  AppDelegate.m
//  BT
//
//  Created by John Schoeman on 5/28/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNCPushNotificationIOS.h>
#import <UserNotifications/UserNotifications.h>
#import <RNSplashScreen.h>
#import <BT-Swift.h>
#import <Bugsnag/Bugsnag.h>
#import "ReactNativeConfig.h"
#import <React/RCTLinkingManager.h>

#if DEBUG
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitLayoutPlugin/SKDescriptorMapper.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#endif

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [self initializeFlipper:application];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"COVIDSafePaths"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;

  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  
  [ExposureManager createSharedInstance];
  [[ExposureManager shared] registerBackgroundTask];

  [RNSplashScreen showSplash:@"LaunchScreen" inRootView:rootView];
  
  // Read dev environment variable
#if DEBUG
  [Bugsnag start];
#else
  if ([[ReactNativeConfig envFor:@"ENABLE_ERROR_REPORTING"]  isEqual: @"true"]) {
    [Bugsnag start];
  }
#endif
  return YES;
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
  [[ExposureManager shared] awake];
}

- (void) initializeFlipper:(UIApplication *)application {
#if DEBUG
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin: [[FlipperKitLayoutPlugin alloc] initWithRootNode: application withDescriptorMapper: layoutDescriptorMapper]];
  [client addPlugin: [[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin: [FlipperKitReactPlugin new]];
  [client addPlugin: [[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
#endif
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
 [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
 [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

-(BOOL) isFirstTimeClosing {
  //Show local notifiation at first time only.
  if(![[NSUserDefaults standardUserDefaults] boolForKey:@"cxfed_NotificationAtFirstTimeOnly"]) {
    [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"cxfed_NotificationAtFirstTimeOnly"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    return TRUE;
  }
  return FALSE;
}

- (BOOL)hasNotificationPermissions {
  //Checking local notification permission or not.
  UIUserNotificationSettings *grantedSettings = [[UIApplication sharedApplication] currentUserNotificationSettings];
  if (grantedSettings.types != UIUserNotificationTypeNone){
    return TRUE;
  }
  return FALSE;
}

- (void)applicationWillTerminate:(UIApplication *)application {
  if([self isFirstTimeClosing] && [self hasNotificationPermissions]) {
  }
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  NSString *urlString = response.notification.request.content.userInfo[@"url"];
  if (urlString != nil) {
    NSURL *url = [[NSURL alloc] initWithString:urlString];
    NSDictionary *options = [[NSDictionary alloc] init];
    [RCTLinkingManager application:[UIApplication sharedApplication] openURL:url options:options];
  }
}

@end
