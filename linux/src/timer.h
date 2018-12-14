#ifndef __CASTLE_TIMER_H__
#define __CASTLE_TIMER_H__

#include <time.h>

class Timer {
private:
  bool mHasStarted = false;
  struct timespec mStartTime;

public:
  void start();
  void reset() { start(); }
  double elapsedTimeS();
  bool hasStarted() { return mHasStarted; }
};

#endif // __CASTLE_TIMER_H__