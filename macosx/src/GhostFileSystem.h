#import <Foundation/Foundation.h>

@interface GhostFileSystem : NSObject

+ (NSString *)ghostCachesDirectory;
+ (NSString *)pathToFileInAppBundle:(NSString *)filename;

@end
