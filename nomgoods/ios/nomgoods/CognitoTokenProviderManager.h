#import <Foundation/NSObject.h>
#import <AWSCognito/AWSCognito.h>
#import <AWSCore/AWSCore.h>

@interface CognitoTokenProviderManager : NSObject<AWSIdentityProviderManager>

@property (nonatomic, copy) NSDictionary<NSString*, NSString*> * _Nullable tokens;

- (nonnull instancetype)initWithTokens:(NSDictionary<NSString*, NSString*> * _Nonnull)inputTokens;
- (AWSTask<NSDictionary<NSString*,NSString*> *> * )logins;

@end
