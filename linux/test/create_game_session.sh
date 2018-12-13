#!/usr/bin/env bash

# Good:
url="https://raw.githubusercontent.com/jesseruder/triangle_warz/b89e4045f8a2a36c760ce043e133a2903ac38e8a/combined.lua"

# Lots of logs:
# url="https://raw.githubusercontent.com/jesseruder/triangle_warz/da3e16193ab788c6a3d8803eb48eb411294740db/combined.lua"
aws gamelift create-game-session --endpoint-url http://localhost:9080 --maximum-player-session-count 2 --fleet-id fleet-123 --game-session-data "castle$url"