#!/usr/bin/env bash

docker tag castle-game-server gcr.io/castle-server/castle-game-server-image
docker push gcr.io/castle-server/castle-game-server-image
