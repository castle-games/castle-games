#!/usr/bin/env bash

# Run this outside of Docker

cp ../build/castle-server gamelift-upload/
rm -rf gamelift-upload/base
cp -r ../build/base gamelift-upload/

oldversion=`cat gamelift-upload/version.txt`
newversion=`expr $oldversion + 1`
sed -i '' "s/$oldversion\$/$newversion/g" gamelift-upload/version.txt

echo "Uploading build..."
uploadOutput=`aws gamelift upload-build --operating-system AMAZON_LINUX --build-root gamelift-upload --name "castle" --build-version $newversion --region us-west-2`
buildId=$(echo $uploadOutput | sed 's/.*Build ID: \([a-zA-Z0-9_-]*\).*/\1/')

echo "Build ID: $buildId"
echo "Waiting for build to be ready..."
buildStatus=""
while [[ ${buildStatus} != *"\"READY\""* ]]
do
buildStatus=`aws gamelift describe-build --build-id $buildId --region us-west-2`
done

echo "Creating fleet..."
# TODO: add metric groups
createFleetOutput=`aws gamelift create-fleet --name "castle-build-$newversion" --description "Castle fleet for version $newversion" --ec2-instance-type "c4.large" --fleet-type "ON_DEMAND" --build-id "$buildId" --runtime-configuration "GameSessionActivationTimeoutSeconds=300, MaxConcurrentGameSessionActivations=1, ServerProcesses=[{LaunchPath=/local/game/castle-server, ConcurrentExecutions=1}]" --new-game-session-protection-policy "FullProtection" --resource-creation-limit-policy "NewGameSessionsPerCreator=1, PolicyPeriodInMinutes=15" --ec2-inbound-permissions "FromPort=22122,ToPort=22122,IpRange=0.0.0.0/0,Protocol=UDP"`

echo $createFleetOutput
