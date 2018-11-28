#!/usr/bin/env bash

# Run this outside of Docker

aws gamelift describe-alias --alias-id alias-893656f2-c282-48a7-a3f9-60dc98332062 --query 'Alias.RoutingStrategy.FleetId' --output text