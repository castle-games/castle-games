#include "timer.h"

void Timer::start() {
  mHasStarted = true;
  clock_gettime(CLOCK_MONOTONIC, &mStartTime);
}

double Timer::elapsedTimeS() {
  struct timespec finishTime;
  double elapsed;

  clock_gettime(CLOCK_MONOTONIC, &finishTime);
  elapsed = (finishTime.tv_sec - mStartTime.tv_sec);
  elapsed += (finishTime.tv_nsec - mStartTime.tv_nsec) / 1000000000.0;
  return elapsed;
}
