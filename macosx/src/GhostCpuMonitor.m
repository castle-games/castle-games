#import "GhostCpuMonitor.h"

#include <mach/mach.h>
#include <mach/mach_host.h>
#include <mach/processor_info.h>
#include <sys/sysctl.h>
#include <sys/types.h>

#define GHOST_CPU_MONITOR_INTERVAL_SEC 3

@interface GhostCpuMonitor () {
  processor_info_array_t cpuInfo, prevCpuInfo;
  mach_msg_type_number_t numCpuInfo, numPrevCpuInfo;
  float *usage;
}

@property(nonatomic, assign) unsigned numCPUs;
@property(nonatomic, strong) NSTimer *updateTimer;
@property(nonatomic, strong) NSLock *CPUUsageLock;
@property(nonatomic, copy) void (^updateCallback)(unsigned, float *);

@end

@implementation GhostCpuMonitor

- (void)start:(void (^)(unsigned, float *))callback {
  [self _countCPUs];
  usage = malloc(_numCPUs * sizeof(float));
  _CPUUsageLock = [[NSLock alloc] init];
  _updateCallback = callback;
  _updateTimer = [NSTimer scheduledTimerWithTimeInterval:GHOST_CPU_MONITOR_INTERVAL_SEC
                                                  target:self
                                                selector:@selector(_updateInfo:)
                                                userInfo:nil
                                                 repeats:YES];
}

- (void)stop {
  if (_updateTimer) {
    [_updateTimer invalidate];
    _updateTimer = nil;
  }
  if (prevCpuInfo) {
    size_t prevCpuInfoSize = sizeof(integer_t) * numPrevCpuInfo;
    vm_deallocate(mach_task_self(), (vm_address_t)prevCpuInfo, prevCpuInfoSize);
    prevCpuInfo = NULL;
    numPrevCpuInfo = 0U;
  }
  if (usage) {
    free(usage);
    usage = NULL;
  }
}

- (void)_countCPUs {
  int mib[2U] = {CTL_HW, HW_NCPU};
  size_t sizeOfNumCPUs = sizeof(_numCPUs);
  int status = sysctl(mib, 2U, &_numCPUs, &sizeOfNumCPUs, NULL, 0U);
  if (status) {
    _numCPUs = 1;
  }
}

- (void)_updateInfo:(__unused NSTimer *)sender {
  natural_t numCPUsU = 0U;
  kern_return_t result = host_processor_info(mach_host_self(), PROCESSOR_CPU_LOAD_INFO, &numCPUsU,
                                             &cpuInfo, &numCpuInfo);
  if (result == KERN_SUCCESS) {
    [_CPUUsageLock lock];

    for (unsigned cpuIdx = 0U; cpuIdx < _numCPUs; ++cpuIdx) {
      float inUse, total;
      if (prevCpuInfo) {
        inUse = ((cpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_USER] -
                  prevCpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_USER]) +
                 (cpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_SYSTEM] -
                  prevCpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_SYSTEM]) +
                 (cpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_NICE] -
                  prevCpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_NICE]));
        total = inUse + (cpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_IDLE] -
                         prevCpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_IDLE]);
      } else {
        inUse = cpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_USER] +
                cpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_SYSTEM] +
                cpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_NICE];
        total = inUse + cpuInfo[(CPU_STATE_MAX * cpuIdx) + CPU_STATE_IDLE];
      }

      usage[cpuIdx] = inUse / total;
    }
    [_CPUUsageLock unlock];

    if (prevCpuInfo) {
      size_t prevCpuInfoSize = sizeof(integer_t) * numPrevCpuInfo;
      vm_deallocate(mach_task_self(), (vm_address_t)prevCpuInfo, prevCpuInfoSize);
    }

    prevCpuInfo = cpuInfo;
    numPrevCpuInfo = numCpuInfo;

    cpuInfo = NULL;
    numCpuInfo = 0U;

    if (_updateCallback) {
      _updateCallback(_numCPUs, usage);
    }
  } else {
    NSLog(@"Failed to measure CPU info, stopping task");
    [self stop];
  }
}

@end
