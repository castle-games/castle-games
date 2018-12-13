#!/usr/bin/env bash

# Run this outside of Docker

ip=`cat test_instance_ip.txt`
ssh -i testgameliftkey.pem ec2-user@$ip