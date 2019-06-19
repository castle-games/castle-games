#import "GhostEnv.h"

NSString *const kCastleUseCustomWebUrlKey = @"CastleUseCustomWebUrl";
NSString *const kCastleCustomWebUrlKey = @"CastleCustomWebUrl";
NSString *const kCastleCheckForUpdatesInDevModeKey = @"CastleCheckForUpdatesInDevMode";
NSString *const kCastleDisableUpdatesEntirelyKey = @"CastleDisableUpdatesEntirely";

@interface GhostEnv ()

@end

@implementation GhostEnv

+ (NSString *)initialCastleUrl {
  NSString *customIndexPath = [self _indexPathFromEnvPlist];
  if (customIndexPath) {
    return customIndexPath;
  } else {
    return [self _indexPathFromBundle];
  }
}

// Lazy-load the config just once
+ (NSDictionary *)_configFromPlist {
  static NSDictionary *plistConfig = nil;
  if (!plistConfig) {
    NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"ghost-env" ofType:@"plist"];
    plistConfig = (plistPath) ? [NSDictionary dictionaryWithContentsOfFile:plistPath]
                              : [NSDictionary dictionary];
  }
  return plistConfig;
}

+ (NSString *)_indexPathFromBundle {
  NSString *indexPath = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html" inDirectory:@"web"];
  NSAssert(indexPath && indexPath.length,
           @"The NSBundle must contain an embedded index.html to run Castle");
  indexPath = [NSString stringWithFormat:@"file://%@", indexPath];
  return indexPath;
}

+ (NSString *)_indexPathFromEnvPlist {
  NSDictionary *config = [self _configFromPlist];
  if (config[kCastleUseCustomWebUrlKey] != nil) {
    BOOL useCustomUrl = [config[kCastleUseCustomWebUrlKey] boolValue];
    if (useCustomUrl) {
      return config[kCastleCustomWebUrlKey];
    }
  }
  return nil;
}

+ (BOOL)shouldCheckForUpdatesInDevMode {
  NSDictionary *config = [self _configFromPlist];
  if (config[kCastleCheckForUpdatesInDevModeKey] != nil) {
    return [config[kCastleCheckForUpdatesInDevModeKey] boolValue];
  }
  return false;
}

+ (BOOL)disableUpdatesEntirely {
  NSDictionary *config = [self _configFromPlist];
  if (config[kCastleDisableUpdatesEntirelyKey] != nil) {
    return [config[kCastleDisableUpdatesEntirelyKey] boolValue];
  }
  return false;
}

@end
