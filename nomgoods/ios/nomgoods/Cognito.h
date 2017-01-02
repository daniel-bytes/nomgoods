#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#import "RCTLog.h"
#import <AWSCognito/AWSCognito.h>
#import <AWSCore/AWSCore.h>

@class CognitoTokenProviderManager;

@interface Cognito : RCTEventEmitter <RCTBridgeModule>

@property CognitoTokenProviderManager *provider;
@property AWSCognitoCredentialsProvider *credentialsProvider;
@property AWSServiceConfiguration *configuration;
@property NSMutableDictionary<NSString*, AWSCognitoDataset*> *datasets;

@end
