#!/usr/bin/env bash

# Good with fixed heartbeat of 1:
url="https://raw.githubusercontent.com/jesseruder/triangle_warz/f7e26c40b2065f68759f240af05334e1546ea84f/combined.lua"

# Lots of logs:
# url="https://raw.githubusercontent.com/jesseruder/triangle_warz/da3e16193ab788c6a3d8803eb48eb411294740db/combined.lua"
aws gamelift create-game-session --endpoint-url http://localhost:9080 --maximum-player-session-count 2 --fleet-id fleet-123 --game-session-data "castle$url"
