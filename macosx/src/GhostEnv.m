#import "GhostEnv.h"

NSString *const kCastleUseCustomWebUrlKey = @"CastleUseCustomWebUrl";
NSString *const kCastleCustomWebUrlKey = @"CastleCustomWebUrl";
NSString *const kCastleCheckForUpdatesInDevModeKey = @"CastleCheckForUpdatesInDevMode";

@implementation GhostEnv

+ (NSString *)initialCastleUrl {
  NSString *customIndexPath = [self _indexPathFromEnvPlist];
  if (customIndexPath) {
    return customIndexPath;
  } else {
    return [self _indexPathFromBundle];
  }
}

+ (NSString *)_indexPathFromBundle {
  NSString *indexPath = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html"];
  NSAssert(indexPath && indexPath.length,
           @"The NSBundle must contain an embedded index.html to run Castle");
  indexPath = [NSString stringWithFormat:@"file://%@", indexPath];
  return indexPath;
}

+ (NSString *)_indexPathFromEnvPlist {
  NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"ghost-env" ofType:@"plist"];
  NSDictionary *config = (plistPath) ? [NSDictionary dictionaryWithContentsOfFile:plistPath]
                                     : [NSDictionary dictionary];
  if (config[kCastleUseCustomWebUrlKey] != nil) {
    BOOL useCustomUrl = [config[kCastleUseCustomWebUrlKey] boolValue];
    if (useCustomUrl) {
      return config[kCastleCustomWebUrlKey];
    }
  }
  return nil;
}

+ (BOOL)shouldCheckForUpdatesInDevMode {
  NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"ghost-env" ofType:@"plist"];
  NSDictionary *config = (plistPath) ? [NSDictionary dictionaryWithContentsOfFile:plistPath]
  : [NSDictionary dictionary];
  if (config[kCastleCheckForUpdatesInDevModeKey] != nil) {
    return [config[kCastleCheckForUpdatesInDevModeKey] boolValue];
  }
  return false;
}

@end
