#!/usr/bin/env bash

# Run this outside of Docker

cd ..

cp -r ../base build/base

docker build -t castle-game-server -f deploy/Dockerfile .
