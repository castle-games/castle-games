#include "aws.h"

#define AWS_ACCESS_KEY "AKIAIYZJVIYATRZDBP5Q"
#define AWS_SECRET_KEY "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"

Aws::Auth::AWSCredentials castleAwsCredentials() {
  Aws::Auth::AWSCredentials credentials(AWS_ACCESS_KEY, AWS_SECRET_KEY);
  return credentials;
}

Aws::Client::ClientConfiguration castleAwsConfiguration() {
  Aws::Client::ClientConfiguration configuration;
  configuration.region = "us-west-2";
  return configuration;
}
