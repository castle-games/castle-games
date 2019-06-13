
#pragma once
#include <windows.h>

typedef DWORD(WINAPI *GhostCpuCallback)(float usage);

// http://www.philosophicalgeek.com/2009/01/03/determine-cpu-usage-of-current-process-c-and-c/
class GhostCpu {
public:
  GhostCpu(void);
  ~GhostCpu();

  void MeasureUsage();
  void StartMonitor(GhostCpuCallback callback);
  void StopMonitor();

private:
  float GetUsage();
  bool EnoughTimePassed();
  inline bool IsFirstRun() const { return (m_dwLastRun == 0); }
  ULONGLONG SubtractTimes(const FILETIME& ftA, const FILETIME& ftB);

  // system total times
  FILETIME m_ftPrevSysKernel;
  FILETIME m_ftPrevSysUser;

  // process times
  FILETIME m_ftPrevProcKernel;
  FILETIME m_ftPrevProcUser;

  float m_nCpuUsage;
  ULONGLONG m_dwLastRun;
  volatile LONG m_lRunCount;

  // monitor thread
  GhostCpuCallback m_callback;
  HANDLE m_monitorThread;
};