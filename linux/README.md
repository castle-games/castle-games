# Linux Server

This directory contains scripts and a Dockerfile used to build the binary we deploy on GameLift.

`gamelift/` contains scripts and source code needed to deploy and debug GameLift.
`test/` contains scripts and a Dockerfile used for testing the castle-server binary.

### Building castle-server

From this directory:

`./build_docker_image.sh` - Only need to run once. This builds a Docker image with everything needed to compile castle-server.

`./docker.sh` - Creates a new container and starts a bash session.

Once you're in the container, cd into `linux` and run:
`cd aws-sdk && ./build_aws_sdk.sh && cd ..`
`./run_cmake.sh`.

### Testing castle-server

Note: You need to build castle-server before doing this.

cd into `test`

`./build_docker_image.sh` - Only need to run once. Includes java and aws-cli which are both needed to run the test server.

`./docker.sh` - Creates a new container and starts a bash session.

Once you're in the container, cd into `linux/test` and run `./run_test_server.sh`. This spawns GameLiftLocal (https://docs.aws.amazon.com/gamelift/latest/developerguide/integration-testing-local.html) and castle-server in the background.

From there you can run `./create_game_session.sh` which simulates creating a new game session. Normally https://github.com/expo/ghost-server/blob/master/server/gamelift.js calls these APIs.

### Deploying

If you don't already have the AWS CLI installed and configured: install it (eg. `brew install awcli` on macOS), then configure it with `aws configure` -- you'll need to log into the AWS console in a browser and go to "My Security Credentials" for your user to get the credentials to paste in.

cd into `gamelift` and run `./deploy_gamelift.sh`. This will create a new GameLift Fleet here: https://us-west-2.console.aws.amazon.com/gamelift/home?region=us-west-2#/r/fleets. It'll take a while (around 10-15 minutes) for the Fleet to be ready. Once it's ready, point the "castle-prod" alias at the new fleet using this page https://us-west-2.console.aws.amazon.com/gamelift/home?region=us-west-2#/r/aliases/alias-893656f2-c282-48a7-a3f9-60dc98332062. https://github.com/expo/ghost-server/blob/master/server/gamelift.js has the ID of the "castle-prod" alias hardcoded.

#### Debugging a GameLift instance

You can SSH into a game server using `./ssh_gamelift.sh` once the fleet has status "Active". Right now it just uses the first instance of the Fleet that "castle-prod" resolves to. Change `Instances[0].InstanceId` if you want to SSH into a different instance.

To attach a debugger, run `sudo yum install -y gdb`. Then use `ps aux` to find the PID of castle-server. Run `sudo gdb -p [PID FROM LAST COMMAND]` to get a debug session.

The game server writes logs to `local/game/log.txt`.

### OpenSSL

OpenSSL from
http://www.openssl.org/source/openssl-1.0.2l.tar.gz

### AWS SDK

https://github.com/aws/aws-sdk-cpp/archive/1.7.14.zip
