
#pragma once
#include <windows.h>

typedef DWORD(WINAPI *GhostCpuCallback)(float usage);

class GhostCpu {
public:
  GhostCpu(void);
  ~GhostCpu();

  void MeasureUsage();
  void StartMonitor(GhostCpuCallback callback);
  void StopMonitor();

private:
  float GetUsage();

  // number of cores
  int num_cpus_;

  // last observed sample
  ULARGE_INTEGER last_cpu_, last_sys_cpu_, last_user_cpu_;

  // monitor thread
  GhostCpuCallback callback_;
  HANDLE monitor_thread_;
};