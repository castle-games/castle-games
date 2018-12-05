#!/usr/bin/env bash

aws gamelift create-game-session --endpoint-url http://localhost:9080 --maximum-player-session-count 2 --fleet-id fleet-123 --game-session-data "castlehttps://raw.githubusercontent.com/jesseruder/triangle_warz/4050b4b83f08222f50f6ea14830d0996e0746ac2/combined.lua"