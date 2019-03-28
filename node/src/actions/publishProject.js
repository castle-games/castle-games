let fs = require('fs');
let path = require('path');
let crypto = require('crypto');
let CastleApiClient = require('castle-api-client');
let FormData = require('form-data');
const packlist = require('npm-packlist');

global.FormData = FormData;
global.Blob = fs.ReadStream;

async function md5Async(filename) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filename)
      .pipe(crypto.createHash('sha1').setEncoding('hex'))
      .once('finish', function() {
        resolve(this.read());
      })
      .once('error', reject);
  });
}

function getBlobForFilename(filename) {
  let f = fs.createReadStream(filename);
  f.__proto__ = Blob.prototype;
  return f;
}

async function listOfFilesAsync(dir) {
  return await packlist({ path: dir });
}

async function publishHostedGame(API, { gameFiles }) {
  const variables = { gameFiles };
  const result = await API.graphqlAsync({
    query: `
      mutation($gameFiles: [GameFile]!) {
        publishHostedGame(gameFiles: $gameFiles)
      }
    `,
    variables,
  });

  // TODO(jim): Write a global error handler.
  if (result.error || result.errors || !result.data) {
    return false;
  }

  return result.data.publishHostedGame;
}

async function publishProjectAsync(args) {
  let dir = args.dir;
  let apiHost = args.apiHost;
  let token = args.token;
  let previousHashes = args.previousHashes;

  let API = CastleApiClient(apiHost);
  await API.client.setTokenAsync(token);

  let files = await listOfFilesAsync(dir);
  let filesToHashes = {};
  await Promise.all(
    files.map(async (filename) => {
      filesToHashes[filename] = await md5Async(path.resolve(dir, filename));
    })
  );

  return await publishHostedGame(API, {
    gameFiles: files.map((filename) => {
      if (previousHashes[filesToHashes[filename]]) {
        // we know server has already seen this file. don't upload
        return {
          path: filename,
          hash: filesToHashes[filename],
        };
      } else {
        return {
          path: filename,
          file: getBlobForFilename(path.resolve(dir, filename)),
        };
      }
    }),
  });
}

module.exports = {
  name: 'publishProject',
  fn: publishProjectAsync,
};
