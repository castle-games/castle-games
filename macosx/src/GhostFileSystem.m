#import "GhostFileSystem.h"

#import <Cocoa/Cocoa.h>

@implementation GhostFileSystem

+ (NSString *)ghostCachesDirectory {
  NSArray<NSURL *> *cachesUrls = [[NSFileManager defaultManager] URLsForDirectory:NSCachesDirectory
                                                                        inDomains:NSUserDomainMask];
  NSURL *userCachePath = [cachesUrls lastObject];
  if (userCachePath) {
    NSString *bundleId = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier"];
    NSString *ghostCachePath =
        [[userCachePath URLByAppendingPathComponent:bundleId] absoluteString];
    BOOL isDirectory;
    BOOL exists =
        [[NSFileManager defaultManager] fileExistsAtPath:ghostCachePath isDirectory:&isDirectory];
    if (!exists) {
      NSError *err;
      [[NSFileManager defaultManager] createDirectoryAtPath:ghostCachePath
                                withIntermediateDirectories:YES
                                                 attributes:nil
                                                      error:&err];
      if (err) {
        NSLog(@"%s: Error creating cache directory %@", __func__, ghostCachePath);
      }
    }
    return ghostCachePath;
  }
  return nil;
}

@end
