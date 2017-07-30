//
//  OAuthManager.m
//  WovenReader
//
//  Created by Nicolas on 9/29/16.
//  Copyright © 2016 Facebook. All rights reserved.
//
#import "OAuthManager.h"
#import "RCTConvert.h"
#import "AppDelegate.h"

typedef void (^STWitterSuccessBlock)(NSArray*);
typedef void (^STWitterErrorBlock)(NSError*);
typedef void (^TwitterEndpointBlock)(NSDictionary*, STWitterSuccessBlock, STWitterErrorBlock);


@interface OAuthManager() {
	
	RCTPromiseResolveBlock _resolveBlock;
	RCTPromiseRejectBlock _rejectBlock;
  
}

@end


@implementation OAuthManager

RCT_EXPORT_MODULE(OAuthManager);

+ (instancetype)sharedInstance {
	static OAuthManager *sharedInstance = nil;
	static dispatch_once_t onceToken;
	
	dispatch_once(&onceToken, ^{
		sharedInstance = [[self alloc] init];
	});
	
	return sharedInstance;
}


- (NSDictionary *)defaultProviderConfiguration{
	return @{
					 @"twitter":
						 @{
							 @"requestTokenUrl": @"https://api.twitter.com/oauth/request_token",
							 @"authorizeUrl":    @"https://api.twitter.com/oauth/authorize",
							 @"accessTokenUrl":  @"https://api.twitter.com/oauth/access_token"
							 },
					 @"facebook":
						 @{
							 @"authorizeUrl":   @"https://www.facebook.com/dialog/oauth",
							 @"accessTokenUrl": @"https://graph.facebook.com/oauth/access_token",
							 @"responseType":   @"token"
							 }
					 };
}

- (NSDictionary *)getDefaultProviderConfig:(NSString *) providerName {
	return [[self defaultProviderConfiguration] objectForKey:providerName];
}

/**
 * configure provider
 *
 * @param {string} providerName - name of the provider we are configuring
 * @param [object] props - properties to set on the configuration object
 */

RCT_EXPORT_METHOD(configureProvider:
									(NSString *)providerName
									props:(NSDictionary *)props
									resolver:(RCTPromiseResolveBlock)resolve
									rejector:(RCTPromiseRejectBlock)reject) {
	
	if (self.providerProperties == nil) {
		self.providerProperties = [[NSDictionary alloc] init];
	}
	
	NSDictionary *defaultProviderConfig = [self getDefaultProviderConfig:providerName];
	
	NSMutableDictionary *globalCurrentConfig = [self.providerProperties mutableCopy];
	NSMutableDictionary *currentProviderConfig = [globalCurrentConfig objectForKey:providerName];
	
	if (currentProviderConfig == nil) {
		currentProviderConfig = [[NSMutableDictionary alloc] init];
	}
	
	NSMutableDictionary *combinedAttributes = [NSMutableDictionary dictionaryWithCapacity:20];
	[combinedAttributes addEntriesFromDictionary:defaultProviderConfig];
	[combinedAttributes addEntriesFromDictionary:currentProviderConfig];
	
	NSString *consumerKey = [RCTConvert NSString:[props valueForKey:@"consumer_key"]];
	NSString *consumerSecret = [RCTConvert NSString:[props valueForKey:@"consumer_secret"]];
	
	if (!consumerKey || !consumerKey.length) {
		return reject(@"Configuration Error", @"Invalid consumer key.", nil);
	}

	if (!consumerSecret || !consumerSecret.length) {
		return reject(@"Configuration Error", @"Invalid consumer secret.", nil);
	}

	NSDictionary *providerProps = @{
																	@"consumerKey": [consumerKey copy],
																	@"consumerSecret": [consumerSecret copy]
																	};
	[combinedAttributes addEntriesFromDictionary:providerProps];
	
	[globalCurrentConfig setObject:combinedAttributes forKey:providerName];
	self.providerProperties = [globalCurrentConfig copy];
	
	NSString *oauthToken = [RCTConvert NSString:[props valueForKey:@"oauth_token"]];
	NSString *oauthSecret = [RCTConvert NSString:[props valueForKey:@"oauth_secret"]];

	if (oauthToken && oauthSecret) {
		
		NSDictionary *providerCreds = @{
																		@"oauthToken": [oauthToken copy],
																		@"oauthSecret": [oauthSecret copy]
																		};
		
		self.providerCredentials = @{providerName : providerCreds};
		
		_twitter = [STTwitterAPI twitterAPIWithOAuthConsumerKey:consumerKey
																						 consumerSecret:consumerSecret
																								 oauthToken:oauthToken
																					 oauthTokenSecret:oauthSecret];
		return resolve(@(YES));
	}
	
	return resolve(@(NO));
//	return callback(@[[NSNull null], globalCurrentConfig]);
}

/**
 * Authorize against a provider with a callback url
 * which is usually set to your App URI, i.e.:
 * 		firestack-example://oauth-callback/{providerName}
 *
 * @param {string} provider - Provider name
 * @param {string} url - The url we're making a request against
 */
RCT_EXPORT_METHOD(authorizeWithCallbackURL:
									(NSString *)provider
									url:(NSString *)strUrl
									resolver:(RCTPromiseResolveBlock)resolve
									rejector:(RCTPromiseRejectBlock)reject)
{
	
	
	NSLog(@"Provider Properties: %@", _providerProperties);
	
	_resolveBlock = resolve;
	_rejectBlock = reject;
	
	NSURL *url = [NSURL URLWithString:strUrl];
	
	if (url == nil) {
		return reject(@"No url",
									[NSString stringWithFormat:@"Url %@ not passed", strUrl],
									nil);
	}
	
	
  [NSThread sleepForTimeInterval:0.5f];
  
	// OAuth 1.0
	if ([provider isEqualToString:@"twitter"]) {
		
		NSDictionary *twitterProperties = _providerProperties[provider];
		NSString *consumerKey = twitterProperties[@"consumerKey"];
		NSString *consumerSecret = twitterProperties[@"consumerSecret"];

		NSDictionary *twitterCredentials = _providerCredentials[provider];
		NSString *oauthToken = twitterCredentials[@"oauthToken"];
		NSString *oauthSecret = twitterCredentials[@"oauthSecret"];
		
		BOOL userAuthenticated = oauthToken != nil && oauthSecret != nil;
		if (!userAuthenticated) {
			_twitter = [STTwitterAPI twitterAPIWithOAuthConsumerKey:consumerKey
																							 consumerSecret:consumerSecret];
		}
		AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
		app.sharedOAuthManager = self;

			[_twitter postTokenRequest:^(NSURL *url, NSString *oauthToken) {
				NSLog(@"-- url: %@", url);
				NSLog(@"-- oauthToken: %@", oauthToken);
				
				
				UIViewController *controller = [UIApplication sharedApplication].keyWindow.rootViewController;
				
				_safariViewController = [[SFSafariViewController alloc] initWithURL:url];
				[controller presentViewController:_safariViewController animated:YES completion:nil];
				
			} authenticateInsteadOfAuthorize:userAuthenticated
											forceLogin:@(NO)
											screenName:nil
									 oauthCallback:@"woven://twitter-auth"
											errorBlock:^(NSError *error) {
												NSLog(@"-- error: %@", error);
												reject(@"Authentication Error", @"Failed to get authentication token.", error);
											}];
			
		}
}

/**
 * Make a signed request using the oauth token
 * and secret stored by the OAuthManager instance
 *
 * @param {string} provider - The provider to call the method against
 * @param {string} url - The URL to make the request against
 * @param {object} params - Any params to make the request
 * @param {object} headers - headers to make the request
 */
RCT_EXPORT_METHOD(makeSignedRequest:(NSString *)provider
									method:(NSString *) methodName
									url:(NSString *) url
									params:(NSDictionary *) params
									resolver:(RCTPromiseResolveBlock)resolve
									rejecter:(RCTPromiseRejectBlock)reject) {
	
	if (_twitter == nil) [self configureInstance];
	
	if ([provider isEqualToString:@"twitter"]) {

		TwitterEndpointBlock block = [self twitterEndpointMap][url];
		if (block) {
			block(params, ^(NSArray *status){
				resolve(status);
				
			}, ^(NSError *error){
				
				NSLog(@"Error %@", error);
				NSError *underlyingError = error.userInfo[NSUnderlyingErrorKey];
				reject([NSString stringWithFormat:@"%ld", (long)underlyingError.code], error.localizedDescription, underlyingError);
				
			});
		} else {
			NSLog(@"Enpoint not supported!");
		}
		
		}
}


#pragma mark - Private

- (void)setOAuthToken:(NSString *)token oauthVerifier:(NSString *)verifier {
	
	if (_twitter == nil) {
		AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
		_twitter = app.sharedOAuthManager.twitter;
		_safariViewController = app.sharedOAuthManager.safariViewController;
		
	}

	[_safariViewController dismissViewControllerAnimated:YES completion:nil];
	
	[_twitter postAccessTokenRequestWithPIN:verifier successBlock:^(NSString *oauthToken, NSString *oauthTokenSecret, NSString *userID, NSString *screenName) {
		NSLog(@"-- screenName: %@", screenName);
		
		
		/*
		 At this point, the user can use the API and you can read his access tokens with:
		 
		 _twitter.oauthAccessToken;
		 _twitter.oauthAccessTokenSecret;
		 
		 You can store these tokens (in user default, or in keychain) so that the user doesn't need to authenticate again on next launches.
		 
		 Next time, just instanciate STTwitter with the class method:
		 
		 +[STTwitterAPI twitterAPIWithOAuthConsumerKey:consumerSecret:oauthToken:oauthTokenSecret:]
		 
		 Don't forget to call the -[STTwitter verifyCredentialsWithSuccessBlock:errorBlock:] after that.
		 */
		
		NSDictionary *dictionary = @{@"username": screenName,
																 @"token": oauthToken,
																 @"secret": oauthTokenSecret};
		
		_resolveBlock(dictionary);
		
	} errorBlock:^(NSError *error) {
		
		NSLog(@"-- %@", [error localizedDescription]);
		
		_rejectBlock(@"Authentication Error", @"Failed to post access token with PIN", error);
		
	}];
}


- (void)configureInstance {
	
	AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
	_twitter = app.sharedOAuthManager.twitter;
	_safariViewController = app.sharedOAuthManager.safariViewController;
	
}

- (NSDictionary *)twitterEndpointMap {
	return @{
					 @"favorites/create":
						 ^void(NSDictionary* params, STWitterSuccessBlock successBlock, STWitterErrorBlock errorBlock){
               [_twitter postFavoriteCreateWithStatusID:params[@"id"]
                                        includeEntities:@(NO)
                                   useExtendedTweetMode:@(NO)
                                           successBlock:^void(NSDictionary* result) {
                                             successBlock(@[result]);
                                           } errorBlock:errorBlock];
						 },
					 @"favorites/destroy":
						 ^void(NSDictionary* params, STWitterSuccessBlock successBlock, STWitterErrorBlock errorBlock){
               [_twitter postFavoriteDestroyWithStatusID:params[@"id"]
                                         includeEntities:@(NO)
                                    useExtendedTweetMode:@(NO)
                                            successBlock:^void(NSDictionary* result) {
                                              successBlock(@[result]);
                                            } errorBlock:errorBlock];
						 },
					 @"users/show":
						 ^void(NSDictionary* params, STWitterSuccessBlock successBlock, STWitterErrorBlock errorBlock){
							 [_twitter getUsersShowForUserID:nil
																	orScreenName:params[@"username"]
															 includeEntities:@(NO)
																	successBlock:^void(NSDictionary* result) {
																		successBlock(@[result]);
																	} errorBlock:errorBlock];
						 },
					 @"friendships/create":
						 ^void(NSDictionary* params, STWitterSuccessBlock successBlock, STWitterErrorBlock errorBlock){
							 [_twitter postFollow:params[@"username"]
											 successBlock:^void(NSDictionary* result) {
												 successBlock(@[result]);
											 } errorBlock:errorBlock];
						 },
           @"friendships/destroy":
             ^void(NSDictionary* params, STWitterSuccessBlock successBlock, STWitterErrorBlock errorBlock){
               [_twitter postFriendshipsDestroyScreenName:params[@"screen_name"]
                                                 orUserID:nil
                                             successBlock:^(NSDictionary *unfollowedUser) {
                                                   successBlock(@[unfollowedUser]);
                                                 } errorBlock:errorBlock];
             },
					 @"friendships/lookup":
						 ^void(NSDictionary* params, STWitterSuccessBlock successBlock, STWitterErrorBlock errorBlock){
							 [_twitter getFriendshipsLookupForScreenNames:params[@"usernames"]
																									orUserIDs:nil
																							 successBlock:successBlock
																								 errorBlock:errorBlock];
						 },
					 @"statuses/update":
						 ^void(NSDictionary* params, STWitterSuccessBlock successBlock, STWitterErrorBlock errorBlock){
               [_twitter postStatusesUpdate:params[@"status"]
                          inReplyToStatusID:params[@"ref_status_id"]
                                   latitude:nil
                                  longitude:nil
                                    placeID:nil
                         displayCoordinates:nil
                                   trimUser:@(NO)
                  autoPopulateReplyMetadata:@(NO)
                 excludeReplyUserIDsStrings:nil
                        attachmentURLString:params[@"attachment_url"]
                       useExtendedTweetMode:@(NO)
                               successBlock:^(NSDictionary *status) {
                                 successBlock(@[status]);
                               } errorBlock:errorBlock];
						},
					 @"statuses/show":
						 ^void(NSDictionary* params, STWitterSuccessBlock successBlock, STWitterErrorBlock errorBlock){
               [_twitter getStatusesShowID:params[@"id"]
                                  trimUser:@(YES)
                          includeMyRetweet:@(NO)
                           includeEntities:@(NO)
                      useExtendedTweetMode:@(NO)
                              successBlock:^(NSDictionary *status) {
                                successBlock(@[status]);
                              } errorBlock:errorBlock];
							 
						 },
           @"statuses/retweet":
             ^void(NSDictionary* params, STWitterSuccessBlock successBlock, STWitterErrorBlock errorBlock){
               [_twitter postStatusRetweetWithID:params[@"id"]
                            useExtendedTweetMode:@(NO)
                                    successBlock:^(NSDictionary *status) {
                                      successBlock(@[status]);
                                    } errorBlock:errorBlock];
             }
					 };
	
}


@end
