#import "CognitoTokenProviderManager.h"

#import <AWSCognito/AWSCognito.h>
#import <AWSCore/AWSCore.h>

@implementation CognitoTokenProviderManager

@synthesize tokens;

- initWithTokens:(NSDictionary<NSString*, NSString*> *)inputTokens {
  if ( self = [super init] ) {
    self.tokens = inputTokens;
  }
  
  return self;
}

- (AWSTask<NSDictionary<NSString*,NSString*> *> *)logins {
  return [AWSTask taskWithResult:self.tokens];
}

@end
