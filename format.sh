#!/bin/sh
#prettier --write js/*.js *.js
clang-format -i -style=file macosx/src/*.{h,m*} macosx/src/ghost-macosx_Helper/*.cpp common/*.{h,cpp}
