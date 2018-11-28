#!/usr/bin/env bash

# Starts a bash session inside of an amazonlinux image with minimal changes
# Run this outside of Docker

docker rm castle-test > /dev/null
docker run -it --name castle-test --mount type=bind,source="$(pwd)"/../..,target=/app castle-test bash
