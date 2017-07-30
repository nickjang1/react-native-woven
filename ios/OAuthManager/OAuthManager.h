//
//  OAuthManager.h
//  WovenReader
//
//  Created by Nicolas on 9/29/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import "STTwitter.h"

@import SafariServices;

@interface OAuthManager : NSObject <RCTBridgeModule>

@property (nonatomic, strong) NSDictionary *providerProperties;
@property (nonatomic, strong) NSDictionary *providerCredentials;

/*
 ** Do not set those properties manually, singleton are not supported in REACT.
 ** Those properties are needed to retrieve values between calls.
 ** https://github.com/facebook/react/issues/5558
*/

@property (nonatomic, strong) STTwitterAPI *twitter;
@property (nonatomic, strong) SFSafariViewController *safariViewController;

+ (instancetype)sharedInstance;
- (void)setOAuthToken:(NSString *)token oauthVerifier:(NSString *)verifier;

@end
