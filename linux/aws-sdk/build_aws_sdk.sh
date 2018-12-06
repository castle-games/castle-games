#!/usr/bin/env bash

# Run this inside the castle-dev Docker image

unzip aws-sdk-cpp.zip
mv aws-sdk-cpp-1.7.14 aws-sdk-cpp

cd aws-sdk-cpp
mkdir build
cd build

cmake -DOPENSSL_ROOT_DIR=/usr/local/ssl -DBUILD_ONLY="s3;gamelift" ..
make install