#!/usr/bin/env bash

# Run this inside the castle-dev Docker image

cmake -DMEGA_LOVE=../love \
	-DOPENSSL_ROOT_DIR=/usr/local/ssl -DOPENSSL_USE_STATIC_LIBS=TRUE \
	-DCMAKE_PREFIX_PATH=gamelift/gamelift-build \
	-DCMAKE_INSTALL_PREFIX="aws-sdk/aws-sdk-cpp/build/.deps/install/lib;/usr/local/ssl/lib" \
	-H. -Bbuild

cmake --build build --config Debug