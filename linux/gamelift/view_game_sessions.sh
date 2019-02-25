#!/usr/bin/env bash

# Run this outside of Docker

fleetId=`./current_fleet_id.sh`
aws gamelift describe-game-sessions --fleet-id $fleetId --status-filter ACTIVE