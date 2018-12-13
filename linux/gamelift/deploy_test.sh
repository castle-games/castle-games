#!/usr/bin/env bash

# Run this outside of Docker

cp ../build/castle-server gamelift-upload/
rm -rf gamelift-upload/base
cp -r ../build/base gamelift-upload/

echo "Uploading build to test server..."
ip=`cat test_instance_ip.txt`
rsync -e 'ssh -i testgameliftkey.pem' -a -i --progress gamelift-upload/ ec2-user@$ip:~
#rsync -e 'ssh -i testgameliftkey.pem' -a --rsync-path="sudo rsync" gamelift-upload/ ec2-user@54.71.54.115:~
