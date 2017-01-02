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
@synthesize datasets;
@synthesize bridge = _bridge;

- (AWSCognitoDataset*) getDataset : (NSString*)name {
  AWSCognitoDataset *dataset = self.datasets[name];
  
  if (dataset == nil) {
    AWSCognito *syncClient = [AWSCognito defaultCognito];
    dataset = [syncClient openOrCreateDataset:name];
    [self.datasets setObject:dataset forKey:name];
  }
  
  return dataset;
}


- (void) handleAWSCognitoDidChangeLocalValueFromRemoteNotification:(NSNotification *)notification {
  NSLog(@"remote change callback: %@", notification.userInfo);
  
  NSString *datasetName = notification.userInfo[@"dataset"];
  NSArray *keys = notification.userInfo[@"keys"];
  
  if (self.datasets[datasetName] != nil) {
    [self sendEventWithName:@"onChange" body:keys];
  }
}
   
 - (NSArray<NSString *> *)supportedEvents {
   return @[@"onChange"];
 }

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(signIn
                  : (NSString *)identityPoolId
                  : (NSString *)tokenType
                  : (NSString *)token
                  : (NSInteger )region
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
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
    
    self.datasets = [NSMutableDictionary dictionary];
    
    [[NSNotificationCenter defaultCenter]
     removeObserver:self
     name:AWSCognitoDidChangeLocalValueFromRemoteNotification
     object:nil];

    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector(handleAWSCognitoDidChangeLocalValueFromRemoteNotification:)
     name:AWSCognitoDidChangeLocalValueFromRemoteNotification
     object:nil];

    [[self.credentialsProvider getIdentityId] continueWithBlock:^id(AWSTask<NSString*> *task) {
      if (task.error) {
        NSLog(@"Cognito:signIn.getIdentityId failed - error %@", task.error);
        
        reject([NSString stringWithFormat:@"%ld", task.error.code], task.error.description, task.error);
      }
      else {
        NSLog(@"Cognito: Signed in");
        
        resolve(@[ task.result ]);
      }
      return nil;
    }];
  }
  @catch(NSException *exc) {
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
  
  resolve(@[ [NSNull null] ]);
}

RCT_EXPORT_METHOD(get
                  : (NSString *)datasetName
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSLog(@"Cognito:get - dataset %@ - begin", datasetName);
  
  @try {
    AWSCognitoDataset *dataset = [self getDataset:datasetName];
    NSDictionary *allValues = [dataset getAll];
    
    /*
    NSMutableDictionary *allValues = [NSMutableDictionary dictionary];
    NSArray *allRecords = [dataset getAllRecords];
    
    for (AWSCognitoRecord* record in allRecords) {
      NSString *name = record.recordId;
      NSString *value = [record.data string];
      BOOL isdeleted = [record isDeleted];
      
      NSLog(@"%@ - %@ : Deleted = %@", name, value, isdeleted ? @"true" : @"false");
      
      if (isdeleted) {
        NSLog(@"%@ deleted, skipping", name);
        continue;
      }
      
      [allValues setObject:value forKey:name];
    }
    */
    
    resolve(@[ allValues ]);
  }
  @catch(NSException *exc) {
    NSLog(@"Cognito:get - dataset %@ - exception %@", datasetName, exc);
    reject(exc.name, exc.description, [NSError errorWithDomain:datasetName
                                                          code:1
                                                      userInfo:@{}]);
  }
}


RCT_EXPORT_METHOD(synchronize
                  : (NSString *)datasetName
                  : (NSArray *)changes
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSLog(@"Cognito:synchronize - dataset %@ - begin", datasetName);
  
  @try {
    AWSCognitoDataset *dataset = [self getDataset:datasetName];
    
    // Set changes
    if (changes != nil) {
      NSArray *existingKeys = [[dataset getAll] allKeys];
      
      for (id change in changes) {
        NSDictionary *obj = (NSDictionary*)change;
        NSString *type = (NSString*)obj[@"type"];
        NSString *key = (NSString*)obj[@"key"];
        
        if ( [type isEqualToString:@"remove"] ) {
          // Remove all existing keys that a prefixed with the input key
          for (id existingKey in existingKeys) {
            NSString *existingKeyString = (NSString*)existingKey;
            
            if ([existingKeyString rangeOfString:key].location == 0) {
              NSLog(@"remove key %@", existingKeyString);
              [dataset removeObjectForKey:existingKeyString];
            }
          }
        }
        else {
          NSString *value = (NSString*)obj[@"value"];
          NSLog(@"set key %@", key);
          [dataset setString:value forKey:key];
        }
      }
    }
    
    // Sync to AWS
    [[dataset synchronizeOnConnectivity] continueWithBlock:^id(AWSTask *task) {
      if (task.error) {
        NSLog(@"Cognito:synchronize:synchronizeOnConnectivity - dataset %@ - error %@", datasetName, task.error);
        reject([NSString stringWithFormat:@"%ld", task.error.code], task.error.description, task.error);
      }
      else {
        resolve(@[ [NSNull null] ]);
      }
      return nil;
    }];
  }
  @catch(NSException *exc) {
    NSLog(@"Cognito:synchronize - dataset %@ - exception %@", datasetName, exc);
    reject(exc.name, exc.description, [NSError errorWithDomain:datasetName
                                                          code:1
                                                      userInfo:@{}]);
  }
}

@end
