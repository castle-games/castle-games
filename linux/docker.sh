#!/usr/bin/env bash

# Starts a bash session inside the castle-dev docker image
# Run this outside of Docker

# `--cap-add=SYS_PTRACE --security-opt seccomp=unconfined` is for gdb
# https://stackoverflow.com/questions/35860527/warning-error-disabling-address-space-randomization-operation-not-permitted

docker rm castle-dev > /dev/null
docker run -it --name castle-dev -p 3014:3014 --mount type=bind,source="$(pwd)"/..,target=/app --cap-add=SYS_PTRACE --security-opt seccomp=unconfined castle-dev bash
