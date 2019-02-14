var fs = require("fs");
var request = require("request");
var exec = require("child_process").exec;

var token = process.env["CASTLE_UPLOAD_TOKEN"];

if (!token) {
  var tokenFilename =
    process.env["DOWNLOADSECUREFILE_SECUREFILEPATH"] ||
    "../../ghost-secret/ci-secret-file.txt";

  token = fs.readFileSync(tokenFilename, "utf8");
}

exec("git rev-parse HEAD", function(error, stdout) {
  stdout = stdout.trim();
  request.post(
    {
      url: "https://api.castle.games/api/upload-client-release",
      headers: {
        "X-Auth-Token": token
      },
      qs: {
        platform: process.argv[2],
        githash: stdout
      },
      formData: {
        file: fs.createReadStream(process.argv[3])
      }
    },
    function(err, resp, body) {
      if (err || resp.statusCode != 200) {
        console.log("Error! " + resp.body);
        process.exit(1);
      } else {
        console.log("Success!");
        process.exit(0);
      }
    }
  );
});
