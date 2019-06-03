#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface GhostCpuMonitor : NSObject

- (void)start:(void (^)(unsigned numCpus, float *usage))callback;
- (void)stop;

@end

NS_ASSUME_NONNULL_END
