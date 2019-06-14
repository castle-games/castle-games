
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

  // last observed sample
  FILETIME last_sys_kernel_, last_sys_user_, last_proc_kernel_, last_proc_user_;

  // monitor thread
  GhostCpuCallback callback_;
  HANDLE monitor_thread_;
};