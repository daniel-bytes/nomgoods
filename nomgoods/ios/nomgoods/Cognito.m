#import "RCTBridge.h"
#import "Cognito.h"
#import "CognitoTokenProviderManager.h"

#import <AWSCognito/AWSCognito.h>
#import <AWSCore/AWSCore.h>
#import "RCTEventDispatcher.h"


@implementation Cognito

@synthesize provider;
@synthesize credentialsProvider;
@synthesize configuration;
@synthesize signedIn;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(signIn
                  : (NSString *)identityPoolId
                  : (NSString *)tokenType
                  : (NSString *)token
                  : (NSInteger )region
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  //NSLog(@"initCredentialsProvider identityPoolId:'%@' tokenType:'%@' token:'%@' region:%li", identityPoolId, tokenType, token, (long)region);
  @try {
    self.provider =
      [[CognitoTokenProviderManager alloc] initWithTokens:@{tokenType : token }];

    self.credentialsProvider =
      [[AWSCognitoCredentialsProvider alloc] initWithRegionType:region
                                             identityPoolId:identityPoolId
                                             identityProviderManager:provider];
    self.configuration =
      [[AWSServiceConfiguration alloc] initWithRegion:region
                                       credentialsProvider:credentialsProvider];
    
    AWSServiceManager.defaultServiceManager.defaultServiceConfiguration = self.configuration;

    NSLog(@"Cognito: Signed in");
    self.signedIn = TRUE;
    
    resolve(@[ [NSNull null] ]);
  }
  @catch(NSException *exc) {
    self.signedIn = FALSE;
    
    NSLog(@"Cognito: signIn failure: %@", exc);
    reject(exc.name, exc.description, [NSError errorWithDomain:tokenType
                                                          code:1
                                                      userInfo:@{}]);
  }
}

RCT_EXPORT_METHOD(signOut
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  if (self.credentialsProvider) {
    [self.credentialsProvider clearCredentials];
    NSLog(@"Cognito: Signed out");
  }
  self.signedIn = FALSE;
  
  resolve(@[ [NSNull null] ]);
}

RCT_EXPORT_METHOD(isSignedIn
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSLog(@"Cognito: isSignedIn %i", self.signedIn);
  resolve(@[ [NSNumber numberWithBool:self.signedIn] ]);
}

RCT_EXPORT_METHOD(getItem
                  : (NSString *)datasetName
                  : (NSString *)key
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSLog(@"Cognito: getItem for dataset %@, key %@", datasetName, key);
  
  @try {
    AWSCognito *syncClient = [AWSCognito defaultCognito];
    AWSCognitoDataset *dataset = [syncClient openOrCreateDataset:datasetName];
    NSString *value = [dataset stringForKey:key];
    
    resolve(@[ value ]);
  }
  @catch(NSException *exc) {
    NSLog(@"Cognito: getItem failure: %@", exc);
    reject(exc.name, exc.description, [NSError errorWithDomain:datasetName
                                                          code:1
                                                      userInfo:@{}]);
  }
}

RCT_EXPORT_METHOD(setItem
                  : (NSString *)datasetName
                  : (NSString *)key
                  : (NSString *)value
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSLog(@"Cognito: setItem for dataset %@, key %@", datasetName, key);
  
  @try {
    AWSCognito *syncClient = [AWSCognito defaultCognito];
    AWSCognitoDataset *dataset = [syncClient openOrCreateDataset:datasetName];
    [dataset setString:value forKey:key];
    
    resolve(@[ value ]);
  }
  @catch(NSException *exc) {
    NSLog(@"Cognito: setItem failure: %@", exc);
    reject(exc.name, exc.description, [NSError errorWithDomain:datasetName
                                                          code:1
                                                      userInfo:@{}]);
  }
}

RCT_EXPORT_METHOD(removeItem
                  : (NSString *)datasetName
                  : (NSString *)key
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  @try {
    NSLog(@"Cognito: removeItem for dataset %@, key %@", datasetName, key);
    
    AWSCognito *syncClient = [AWSCognito defaultCognito];
    AWSCognitoDataset *dataset = [syncClient openOrCreateDataset:datasetName];
    [dataset removeObjectForKey:key];
    
    resolve(@[ [NSNull null] ]);
  }
  @catch(NSException *exc) {
    NSLog(@"Cognito: removeItem failure: %@", exc);
    reject(exc.name, exc.description, [NSError errorWithDomain:datasetName
                                                          code:1
                                                      userInfo:@{}]);
  }
}

RCT_EXPORT_METHOD(synchronize
                  : (NSString *)datasetName
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSLog(@"Cognito: synchronize for dataset %@", datasetName);
  
  @try {
    if (self.signedIn) {
      AWSCognito *syncClient = [AWSCognito defaultCognito];
      AWSCognitoDataset *dataset = [syncClient openOrCreateDataset:datasetName];

      [[dataset synchronize] continueWithBlock:^id(AWSTask *task) {
        if (task.error) {
          NSLog(@"%@", task.error);
          reject([NSString stringWithFormat:@"%ld", task.error.code], task.error.description, task.error);
        }
        else {
          resolve(@[ [NSNull null] ]);
        }
        return nil;
      }];
    }
    else {
      NSLog(@"Not signed in, skipping");
      resolve(@[ [NSNull null] ]);
    }
  }
  @catch(NSException *exc) {
    NSLog(@"Cognito: synchronize failure: %@", exc);
    reject(exc.name, exc.description, [NSError errorWithDomain:datasetName
                                                          code:1
                                                      userInfo:@{}]);
  }
}

@end
