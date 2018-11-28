#!/usr/bin/env bash

aws gamelift create-game-session --endpoint-url http://localhost:9080 --maximum-player-session-count 2 --fleet-id fleet-123 --game-session-data "castlehttps://raw.githubusercontent.com/jesseruder/sync.lua/master/example_basic.lua"