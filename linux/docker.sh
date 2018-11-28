#!/usr/bin/env bash

# Starts a bash session inside the castle-dev docker image
# Run this outside of Docker

docker rm castle-dev > /dev/null
docker run -it --name castle-dev -p 22122:22122/udp --mount type=bind,source="$(pwd)"/..,target=/app castle-dev bash
