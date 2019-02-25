#!/usr/bin/env bash

# Run this outside of Docker

yes | rm InstancePrivateKey.pem

fleetId=`./current_fleet_id.sh`

if [ -z "$GAMELIFT_INSTANCE_ID" ]
then
    #fleetId="fleet-d9079203-f1fb-452c-85ad-5b92ba8b6629"
    GAMELIFT_INSTANCE_ID=`aws gamelift describe-instances --fleet-id $fleetId --query 'Instances[0].InstanceId' --output text`
fi

instanceAccessResult=`aws gamelift get-instance-access --fleet-id $fleetId --instance-id $GAMELIFT_INSTANCE_ID`
instanceIp=$(echo $instanceAccessResult | jq -r '.InstanceAccess.IpAddress')
userName=$(echo $instanceAccessResult | jq -r '.InstanceAccess.Credentials.UserName')
echo $instanceAccessResult | jq -r '.InstanceAccess.Credentials.Secret' > InstancePrivateKey.pem
sed -i '' '$d' InstancePrivateKey.pem

yes | chmod 400 InstancePrivateKey.pem

publicIp=$(dig TXT +short o-o.myaddr.l.google.com @ns1.google.com -4 | awk -F'"' '{ print $2}')
echo "Using IP $publicIp"

aws gamelift update-fleet-port-settings --fleet-id $fleetId --inbound-permission-authorizations "FromPort=22,ToPort=22,IpRange=$publicIp/32,Protocol=TCP"

echo "Connect with: ssh -i InstancePrivateKey.pem $userName@$instanceIp"

if [ -z "$GAMELIFT_SSH_COMMAND" ]
then
    ssh -i InstancePrivateKey.pem $userName@$instanceIp
else
    echo $GAMELIFT_SSH_COMMAND | ssh -i InstancePrivateKey.pem $userName@$instanceIp
fi