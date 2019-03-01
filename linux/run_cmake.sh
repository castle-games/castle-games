#!/usr/bin/env bash

# Run this inside the castle-dev Docker image

cmake -DMEGA_LOVE=../love \
	-I/usr/include/lua5.1 \
	-DOPENSSL_ROOT_DIR=/usr/local/ssl -DOPENSSL_USE_STATIC_LIBS=TRUE \
	-DCMAKE_INSTALL_PREFIX="/usr/local/ssl/lib" \
	-H. -Bbuild

cmake --build build --config Debug