#ifndef __CASTLE_AWS_H__
#define __CASTLE_AWS_H__

#include "aws/core/Aws.h"
#include "aws/core/auth/AWSCredentialsProvider.h"

Aws::Auth::AWSCredentials castleAwsCredentials();
Aws::Client::ClientConfiguration castleAwsConfiguration();

#endif
