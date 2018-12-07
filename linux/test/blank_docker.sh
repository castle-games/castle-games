#!/usr/bin/env bash

# Starts a bash session inside of an amazonlinux image with minimal changes
# Run this outside of Docker

docker rm castle-blank > /dev/null
docker run -it --name castle-blank --mount type=bind,source="$(pwd)"/../build/castle-server,target=/app/castle-server --mount type=bind,source="$(pwd)"/../gamelift/gamelift-upload/lib,target=/app/lib castle-test bash
