#ifndef __CASTLE_LOGS_H__
#define __CASTLE_LOGS_H__

#include "aws/s3/S3Client.h"
#include <string>

class Logs {
private:
  std::string mRootDirectory;
  std::string mUrl;
  int mPort = -1;
  Aws::S3::S3Client mS3Client;
  struct timespec mStartTime;
  bool mHasWrittenSinceLastFlush;

  std::string logFile();
  std::string urlLogFile();
  bool hasUrl();
  void logInternal(std::string str, bool isLua);

public:
  Logs(std::string rootDirectory);
  void log(const char *format, ...);
  void logLua(const char *format, ...);
  void log(std::string str);
  void logLua(std::string str);
  void setUrl(std::string url);
  void setPort(int port);
  void tick();
  void forceFlush();
};

#endif