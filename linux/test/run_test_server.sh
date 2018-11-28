#!/usr/bin/env bash

java -jar GameLiftLocal/GameLiftLocal.jar -p 9080 &
LD_LIBRARY_PATH=../gamelift/gamelift-upload/lib ../build/castle-server &