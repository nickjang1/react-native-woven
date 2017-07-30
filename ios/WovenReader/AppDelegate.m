/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "CodePush.h"

#import "AVFoundation/AVFoundation.h"
#import "RCTBundleURLProvider.h"
#import "RCTPushNotificationManager.h"
#import "RCTRootView.h"
#import "Intercom/intercom.h"
#import <Fabric/Fabric.h>
#import <DigitsKit/DigitsKit.h>
#import <Crashlytics/Crashlytics.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
  

  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
    jsCodeLocation = [CodePush bundleURL];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"WovenReader"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  NSString *intercomAPIKey = @"ios_sdk-13eb58150d12eafd74ad63ff9f4943691c654028";
  NSString *intercomAppID = @"iamyou04";
  
  [Fabric with:@[[Digits class], [Crashlytics class]]];
  
  [Intercom setApiKey:intercomAPIKey forAppId:intercomAppID];
  [Intercom registerUnidentifiedUser];
  [Intercom updateUserWithAttributes:@{
                                        @"custom_attributes": @{ @"app_name" : @"Woven"}
                                        }
   ];
  
  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
	sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
	
	if ([[url scheme] isEqualToString:@"woven"] == NO) return NO;
	
	NSDictionary *d = [self parametersDictionaryFromQueryString:[url query]];
	
	NSString *token = d[@"oauth_token"];
	NSString *verifier = d[@"oauth_verifier"];

	if (self.sharedOAuthManager != nil) {
		[self.sharedOAuthManager setOAuthToken:token oauthVerifier:verifier];
	}
	
	return YES;
}

- (NSDictionary *)parametersDictionaryFromQueryString:(NSString *)queryString {
	
	NSMutableDictionary *md = [NSMutableDictionary dictionary];
	
	NSArray *queryComponents = [queryString componentsSeparatedByString:@"&"];
	
	for(NSString *s in queryComponents) {
		NSArray *pair = [s componentsSeparatedByString:@"="];
		if([pair count] != 2) continue;
		
		NSString *key = pair[0];
		NSString *value = pair[1];
		
		md[key] = value;
	}
	
	return md;
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

//// Required for the registrationError event.
//- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
//{
//  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
//}

// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

@end
