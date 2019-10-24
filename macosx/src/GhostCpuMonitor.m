#import "GhostCpuMonitor.h"

#include <mach/mach.h>
#include <mach/mach_host.h>
#include <mach/processor_info.h>
#include <sys/sysctl.h>
#include <sys/types.h>

#define GHOST_CPU_MONITOR_INTERVAL_SEC 2

@interface GhostCpuMonitor () {
  processor_cpu_load_info_t cpuInfo, prevCpuInfo;
  mach_msg_type_number_t numCpuInfo, numPrevCpuInfo;
  float *usage;
}

@property(nonatomic, strong) NSTimer *updateTimer;
@property(nonatomic, strong) NSLock *CPUUsageLock;
@property(nonatomic, copy) void (^updateCallback)(unsigned, float *);

@end

@implementation GhostCpuMonitor

- (void)start:(void (^)(unsigned, float *))callback {
  if (_updateTimer) {
    // already running
    _updateCallback = callback;
    return;
  }
  unsigned numCPUs = [self _getNumCPUs];
  usage = malloc(numCPUs * sizeof(float));
  _CPUUsageLock = [[NSLock alloc] init];
  _updateCallback = callback;
  _updateTimer = [NSTimer scheduledTimerWithTimeInterval:GHOST_CPU_MONITOR_INTERVAL_SEC
                                                  target:self
                                                selector:@selector(_measureProcessCpuUsage:)
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

- (unsigned)_getNumCPUs {
  int mib[2U] = {CTL_HW, HW_NCPU};
  unsigned numCPUs;
  size_t sizeOfNumCPUs = sizeof(numCPUs);
  int status = sysctl(mib, 2U, &numCPUs, &sizeOfNumCPUs, NULL, 0U);
  if (status) {
    numCPUs = 1;
  }
  return numCPUs;
}

/**
 *  Measure CPU usage for just this process.
 *  Callback is invoked with just a single value (not split by core).
 *  Derived from https://stackoverflow.com/questions/8223348/ios-get-cpu-usage-from-application
 */
- (void)_measureProcessCpuUsage:(__unused NSTimer *)sender {
  float totalTaskUsage = 0;
  thread_array_t threads;
  mach_msg_type_number_t nThreads;

  kern_return_t result = task_threads(mach_task_self(), &threads, &nThreads);
  if (result == KERN_SUCCESS) {
    thread_info_data_t threadInfo;
    mach_msg_type_number_t threadInfoCount;
    thread_basic_info_t threadBasicInfo;
    long threadUsageSec = 0;
    long threadUsageUsec = 0;

    for (natural_t threadIdx = 0; threadIdx < nThreads; threadIdx++) {
      threadInfoCount = THREAD_INFO_MAX;
      kern_return_t result = thread_info(threads[threadIdx], THREAD_BASIC_INFO,
                                         (thread_info_t)threadInfo, &threadInfoCount);
      if (result != KERN_SUCCESS) {
        continue;
      }
      threadBasicInfo = (thread_basic_info_t)threadInfo;
      if (!(threadBasicInfo->flags & TH_FLAGS_IDLE)) {
        threadUsageSec = threadUsageSec + threadBasicInfo->user_time.seconds +
                         threadBasicInfo->system_time.seconds;
        threadUsageUsec = threadUsageUsec + threadBasicInfo->user_time.microseconds +
                          threadBasicInfo->system_time.microseconds;
        totalTaskUsage = totalTaskUsage + threadBasicInfo->cpu_usage / (float)TH_USAGE_SCALE;
      }
    }
  }
  result = vm_deallocate(mach_task_self(), (vm_offset_t)threads, nThreads * sizeof(thread_t));
  if (_updateCallback) {
    usage[0] = totalTaskUsage;
    _updateCallback(1, usage);
  }
}

/**
 *  Measure CPU usage across all processes on the machine.
 *  Callback is invoked with one value per core.
 */
- (void)_measureMachineCpuUsage:(__unused NSTimer *)sender {
  natural_t numCPUsU = 0U;
  kern_return_t result = host_processor_info(mach_host_self(), PROCESSOR_CPU_LOAD_INFO, &numCPUsU,
                                             (processor_info_array_t *)&cpuInfo, &numCpuInfo);
  if (result == KERN_SUCCESS) {
    [_CPUUsageLock lock];

    for (natural_t cpuIdx = 0U; cpuIdx < numCPUsU; ++cpuIdx) {
      unsigned inUse = 0, total = 0;
      if (prevCpuInfo) {
        inUse = cpuInfo[cpuIdx].cpu_ticks[CPU_STATE_USER] -
                prevCpuInfo[cpuIdx].cpu_ticks[CPU_STATE_USER] +
                (cpuInfo[cpuIdx].cpu_ticks[CPU_STATE_SYSTEM] -
                 prevCpuInfo[cpuIdx].cpu_ticks[CPU_STATE_SYSTEM]) +
                cpuInfo[cpuIdx].cpu_ticks[CPU_STATE_NICE] -
                cpuInfo[cpuIdx].cpu_ticks[CPU_STATE_NICE];
        total = inUse + cpuInfo[cpuIdx].cpu_ticks[CPU_STATE_IDLE] -
                prevCpuInfo[cpuIdx].cpu_ticks[CPU_STATE_IDLE];
      } else {
        inUse = cpuInfo[cpuIdx].cpu_ticks[CPU_STATE_USER] +
                cpuInfo[cpuIdx].cpu_ticks[CPU_STATE_SYSTEM] +
                cpuInfo[cpuIdx].cpu_ticks[CPU_STATE_NICE];
        total = inUse + cpuInfo[cpuIdx].cpu_ticks[CPU_STATE_IDLE];
      }

      usage[cpuIdx] = (float)inUse / (float)total;
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
      _updateCallback(numCPUsU, usage);
    }
  } else {
    NSLog(@"Failed to measure CPU info, stopping task");
    [self stop];
  }
}

@end
