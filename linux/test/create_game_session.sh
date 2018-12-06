#!/usr/bin/env bash

aws gamelift create-game-session --endpoint-url http://localhost:9080 --maximum-player-session-count 2 --fleet-id fleet-123 --game-session-data "castlehttps://raw.githubusercontent.com/jesseruder/triangle_warz/b89e4045f8a2a36c760ce043e133a2903ac38e8a/combined.lua"