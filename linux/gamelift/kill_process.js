#!/usr/bin/env node

// run ./view_game_sessions to find the session you want to kill
// then run this with ./kill_process ip port

let child_process = require("child_process");
var args = process.argv.slice(2);

if (args.length !== 2) {
  throw new Error("run with ./kill_process ip port");
}

function spawn(...args) {
  return child_process
    .spawnSync(...args)
    .stdout.toString()
    .trim();
}

spawn("rm", ["InstancePrivateKey.pem"]);
let currentFleetId = spawn("./current_fleet_id.sh");

let instances = JSON.parse(
  spawn("aws", ["gamelift", "describe-instances", "--fleet-id", currentFleetId])
).Instances;

let instance;
for (let i = 0; i < instances.length; i++) {
  if (instances[i].IpAddress === args[0]) {
    instance = instances[i];
  }
}

if (!instance) {
  throw new Error(`ip ${args[0]} not found`);
}

process.env.GAMELIFT_INSTANCE_ID = instance.InstanceId;
process.env.GAMELIFT_SSH_COMMAND = `sudo lsof -ti :${args[1]} | sudo kill`;
child_process.spawn("./ssh_gamelift.sh", {
  stdio: "inherit"
});
