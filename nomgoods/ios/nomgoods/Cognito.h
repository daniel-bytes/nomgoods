#import "RCTBridgeModule.h"
#import "RCTLog.h"
#import <AWSCognito/AWSCognito.h>
#import <AWSCore/AWSCore.h>

@class CognitoTokenProviderManager;

@interface Cognito : NSObject <RCTBridgeModule>

@property CognitoTokenProviderManager *provider;
@property AWSCognitoCredentialsProvider *credentialsProvider;
@property AWSServiceConfiguration *configuration;
@property BOOL signedIn;

@end
