#import <Foundation/Foundation.h>

@interface GhostEnv : NSObject

/**
 *  The initial url to load for the castle web UI.
 *  Defaults to embedded `index.html`. Can be overridden by changing the contents of
 * `ghost-env.plist`.
 */
+ (NSString *)initialCastleUrl;

/**
 *  Whether to check for updates in development mode. Useful while developing the updates
 *  UI itself.
 */
+ (BOOL)shouldCheckForUpdatesInDevMode;

@end
