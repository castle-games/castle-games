#include "logs.h"
#include "aws/core/Aws.h"
#include "aws/core/auth/AWSCredentialsProvider.h"
#include "aws/s3/S3Client.h"
#include "aws/s3/model/PutObjectRequest.h"
#include <curl/curl.h>
#include <fstream>
#include <iostream>
#include <stdarg.h>
#include <stdio.h>

#define AWS_ACCESS_KEY "AKIAIYZJVIYATRZDBP5Q"
#define AWS_SECRET_KEY "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"
#define S3_BUCKET_NAME "castle-server-logs"
#define FLUSH_LOGS_INTERVAL_SECONDS 5

Logs::Logs(std::string rootDirectory) {
  mRootDirectory = rootDirectory;
  Aws::Auth::AWSCredentials credentials(AWS_ACCESS_KEY, AWS_SECRET_KEY);
  Aws::Client::ClientConfiguration configuration;
  configuration.region = "us-west-2";
  mS3Client = Aws::S3::S3Client(credentials, configuration);
  mHasWrittenSinceLastFlush = false;

  clock_gettime(CLOCK_MONOTONIC, &mStartTime);
}

std::string Logs::logFile() { return mRootDirectory + "log.txt"; }

std::string Logs::urlLogFile() { return mRootDirectory + "log-" + mUrl + ".txt"; }

bool Logs::hasUrl() { return !mUrl.empty(); }

void Logs::setUrl(std::string url) {
  CURL *curl = curl_easy_init();
  char *output = curl_easy_escape(curl, url.c_str(), url.length());
  mUrl = std::string(output);
}

void Logs::setPort(int port) { mPort = port; }

void Logs::log(const char *format, ...) {
  va_list args;
  va_start(args, format);
  char buffer[1000];
  vsnprintf(buffer, 1000, format, args);
  va_end(args);

  std::string str = std::string(buffer);
  logInternal(str, false);
}

void Logs::logLua(const char *format, ...) {
  va_list args;
  va_start(args, format);
  char buffer[1000];
  vsnprintf(buffer, 1000, format, args);
  va_end(args);

  std::string str = std::string(buffer);
  logInternal(str, true);
}

void Logs::log(std::string str) { logInternal(str, false); }

void Logs::logLua(std::string str) { logInternal(str, true); }

void Logs::logInternal(std::string str, bool isLua) {
  time_t _tm = time(NULL);
  struct tm *curtime = localtime(&_tm);
  std::string formattedTime = std::string(asctime(curtime));
  formattedTime.erase(std::remove(formattedTime.begin(), formattedTime.end(), '\n'),
                      formattedTime.end());

  std::string output = formattedTime;
  if (mPort != -1) {
    output = output + " (port " + std::to_string(mPort) + ")";
  }
  output = output + ": " + str;

  std::cout << output << std::endl;

  std::ofstream outfile;
  outfile.open(logFile(), std::ofstream::out | std::ofstream::app);
  outfile << output << std::endl;

  if (isLua && hasUrl()) {
    std::ofstream outfile2;
    outfile2.open(urlLogFile(), std::ofstream::out | std::ofstream::app);
    outfile2 << output << std::endl;
    mHasWrittenSinceLastFlush = true;
  }
}

void Logs::tick() {
  struct timespec finishTime;
  double elapsed;

  clock_gettime(CLOCK_MONOTONIC, &finishTime);
  elapsed = (finishTime.tv_sec - mStartTime.tv_sec);
  elapsed += (finishTime.tv_nsec - mStartTime.tv_nsec) / 1000000000.0;

  if (elapsed > FLUSH_LOGS_INTERVAL_SECONDS) {
    forceFlush();
    clock_gettime(CLOCK_MONOTONIC, &mStartTime);
  }
}

void Logs::forceFlush() {
  if (!hasUrl()) {
    return;
  }
  if (!mHasWrittenSinceLastFlush) {
    return;
  }
  mHasWrittenSinceLastFlush = false;

  std::string key = "logs-" + mUrl;
  Aws::S3::Model::PutObjectRequest objectRequest;
  objectRequest.WithBucket(S3_BUCKET_NAME).WithKey(key.c_str());

  auto inputData = Aws::MakeShared<Aws::FStream>("PutObjectInputStream", urlLogFile().c_str(),
                                                 std::ios_base::in | std::ios_base::binary);
  objectRequest.SetBody(inputData);

  auto put_object_outcome = mS3Client.PutObject(objectRequest);

  if (put_object_outcome.IsSuccess()) {
    std::cout << "Uploaded logs to S3" << std::endl;
  } else {
    std::cout << "PutObject error: " << put_object_outcome.GetError().GetExceptionName() << " "
              << put_object_outcome.GetError().GetMessage() << std::endl;
  }
}