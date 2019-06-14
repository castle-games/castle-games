#include "StdAfx.h"
#include <windows.h>
#include "ghost_cpu.h"

static inline ULONGLONG SubtractTimes(const FILETIME &ftA, const FILETIME &ftB) {
  ULARGE_INTEGER ulA, ulB;
  ulA.LowPart = ftA.dwLowDateTime;
  ulA.HighPart = ftA.dwHighDateTime;
  ulB.LowPart = ftB.dwLowDateTime;
  ulB.HighPart = ftB.dwHighDateTime;
  return ulA.QuadPart - ulB.QuadPart;
}

#define GHOST_CPU_POLL_MS 2000
DWORD WINAPI GhostCpuMonitorThreadProc(LPVOID lpParam);

GhostCpu::GhostCpu(void)
  :monitor_thread_(NULL)
{
  ZeroMemory(&last_sys_kernel_, sizeof(last_sys_kernel_));
  ZeroMemory(&last_sys_user_, sizeof(last_sys_user_));
  ZeroMemory(&last_proc_kernel_, sizeof(last_proc_kernel_));
  ZeroMemory(&last_proc_user_, sizeof(last_proc_user_));
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

  // compute initial sample
  FILETIME dummy;
  GetSystemTimes(&dummy, &last_sys_kernel_, &last_sys_user_);
  GetProcessTimes(GetCurrentProcess(), &dummy, &dummy, &last_proc_kernel_, &last_proc_user_);

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
  // compute current sample
  FILETIME dummy, curr_sys_kernel, curr_sys_user, curr_proc_kernel, curr_proc_user;
  GetSystemTimes(&dummy, &curr_sys_kernel, &curr_sys_user);
  GetProcessTimes(GetCurrentProcess(), &dummy, &dummy, &curr_proc_kernel, &curr_proc_user);

  // compute our percentage across last interval
  ULONGLONG dSys = SubtractTimes(curr_sys_kernel, last_sys_kernel_) + SubtractTimes(curr_sys_user, last_sys_user_);
  ULONGLONG dProc = SubtractTimes(curr_proc_kernel, last_proc_kernel_) + SubtractTimes(curr_proc_user, last_proc_user_);
  double percent = 0;
  if (dSys > 0) {
    percent = ((double) dProc) / dSys;
  }

  // save sample
  last_sys_kernel_ = curr_sys_kernel;
  last_sys_user_ = curr_sys_user;
  last_proc_kernel_ = curr_proc_kernel;
  last_proc_user_ = curr_proc_user;

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