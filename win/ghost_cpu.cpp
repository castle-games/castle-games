#include "StdAfx.h"
#include <windows.h>
#include "ghost_cpu.h"

#define GHOST_CPU_POLL_MS 2000
DWORD WINAPI GhostCpuMonitorThreadProc(LPVOID lpParam);

GhostCpu::GhostCpu(void)
  :num_cpus_(0), monitor_thread_(NULL)
{
  ZeroMemory(&last_cpu_, sizeof(ULARGE_INTEGER));
  ZeroMemory(&last_sys_cpu_, sizeof(ULARGE_INTEGER));
  ZeroMemory(&last_user_cpu_, sizeof(ULARGE_INTEGER));
}

GhostCpu::~GhostCpu() {
  StopMonitor();
}

void GhostCpu::StartMonitor(GhostCpuCallback callback) {
  if (monitor_thread_) {
    // already running
    callback_ = callback;
    return;
  }
  SYSTEM_INFO sys_info;
  GetSystemInfo(&sys_info);
  num_cpus_ = sys_info.dwNumberOfProcessors;

  // compute initial sample
  FILETIME ftime, fsys, fuser;
  GetSystemTimeAsFileTime(&ftime);
  memcpy(&last_cpu_, &ftime, sizeof(FILETIME));

  GetProcessTimes(GetCurrentProcess(), &ftime, &ftime, &fsys, &fuser);
  memcpy(&last_sys_cpu_, &fsys, sizeof(FILETIME));
  memcpy(&last_user_cpu_, &fuser, sizeof(FILETIME));

  // spawn monitor thread
  callback_ = callback;
  monitor_thread_ = CreateThread(NULL, 0, GhostCpuMonitorThreadProc, (LPVOID) this, 0, NULL);
}

void GhostCpu::StopMonitor() {
  if (monitor_thread_) {
    CloseHandle(monitor_thread_);
    monitor_thread_ = NULL;
  }
}

float GhostCpu::GetUsage() {
  float percent;
  FILETIME ftime, fsys, fuser;
  ULARGE_INTEGER current_cpu_, current_sys_cpu_, current_user_cpu_;

  // compute next sample
  GetSystemTimeAsFileTime(&ftime);
  memcpy(&current_cpu_, &ftime, sizeof(FILETIME));

  GetProcessTimes(GetCurrentProcess(), &ftime, &ftime, &fsys, &fuser);
  memcpy(&current_sys_cpu_, &fsys, sizeof(FILETIME));
  memcpy(&current_user_cpu_, &fuser, sizeof(FILETIME));

  // https://stackoverflow.com/questions/63166/how-to-determine-cpu-and-memory-consumption-from-inside-a-process
  percent = (current_sys_cpu_.QuadPart - last_sys_cpu_.QuadPart) + (current_user_cpu_.QuadPart - last_user_cpu_.QuadPart);
  percent /= (current_cpu_.QuadPart - last_cpu_.QuadPart);
  percent /= num_cpus_; // normalize to 100% even across multiple cores

  last_cpu_ = current_cpu_;
  last_user_cpu_ = current_user_cpu_;
  last_sys_cpu_ = current_sys_cpu_;

  return percent;
}

void GhostCpu::MeasureUsage() {
  float usage = GetUsage();
  if (callback_) {
    callback_(usage);
  }
}

DWORD WINAPI GhostCpuMonitorThreadProc(LPVOID lpParam) {
  GhostCpu *usage = (GhostCpu *)lpParam;
  while (true) {
    usage->MeasureUsage();
    Sleep(GHOST_CPU_POLL_MS);
  }
}