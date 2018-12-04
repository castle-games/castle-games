#!/usr/bin/env bash

aws gamelift create-game-session --endpoint-url http://localhost:9080 --maximum-player-session-count 2 --fleet-id fleet-123 --game-session-data "castlehttps://raw.githubusercontent.com/jesseruder/share.lua/b333174e6c3ea68f0fa5a6955cd64c3f3813be83/example_server.lua"