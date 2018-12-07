#!/usr/bin/env bash

# Run this inside the castle-dev Docker image
# This removes all files in gamelift-upload/lib that aren't used by the binary

lddOutput=`ldd -d ../build/castle-server`

cd gamelift-upload/lib
for filename in *; do
    if [[ ! $lddOutput == *"$filename"* ]]; then
        rm $filename
    fi
done
