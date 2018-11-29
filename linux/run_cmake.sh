#!/usr/bin/env bash

# Run this inside the castle-dev Docker image

cmake -DMEGA_LOVE=../love \
	-DOPENSSL_ROOT_DIR=/usr/local/ssl -DOPENSSL_USE_STATIC_LIBS=TRUE \
	-D CMAKE_PREFIX_PATH=gamelift/gamelift-build \
	-H. -Bbuild

cmake --build build --config Debug