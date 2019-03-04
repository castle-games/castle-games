#!/usr/bin/env bash

# Run this outside of Docker

cd ..

rm -rf build/base
cp -r ../base build/base
cp conf.lua build/base/conf.lua

docker build -t castle-game-server -f deploy/Dockerfile .
