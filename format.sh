#!/bin/sh
#prettier --write js/*.js *.js
clang-format -i -style=file macosx/*.{h,m*} macosx/ghost-macosx_Helper/*.cpp
