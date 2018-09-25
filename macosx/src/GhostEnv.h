#import <Foundation/Foundation.h>

@interface GhostEnv : NSObject

/**
 *  The initial url to load for the castle web UI.
 *  Defaults to embedded `index.html`. Can be overridden by changing the contents of `ghost-env.plist`.
 */
+ (NSString *)initialCastleUrl;

@end
