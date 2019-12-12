let fs = require('fs');
let path = require('path');
let crypto = require('crypto');
let CastleApiClient = require('castle-api-client/node');
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

async function _uploadGame(API, { gameFiles }) {
  const variables = { gameFiles };
  const result = await API.graphqlAsync({
    query: `
      mutation($gameFiles: [GameFile]!) {
        uploadGame(gameFiles: $gameFiles)
      }
    `,
    variables,
  });

  if (!result || result.error || result.errors || !result.data) {
    const message = result.error
      ? result.error.message
      : result.errors && result.errors.length
      ? result.errors[0].message
      : null;
    throw new Error(`failed to upload game: ${message}`);
  }

  return result.data.uploadGame;
}

async function testHostedGameHashes(API, { hashes }) {
  const variables = { hashes };
  const result = await API.graphqlAsync({
    query: `
      query($hashes: [String]!) {
        testHostedGameHashes(hashes: $hashes)
      }
    `,
    variables,
  });

  if (!result || result.error || result.errors || !result.data) {
    return {};
  }

  return result.data.testHostedGameHashes;
}

async function uploadGameAsync(args) {
  let dir = args.dir;
  let apiHost = args.apiHost;
  let token = args.token;
  let previousHashes = args.previousHashes;

  let API = CastleApiClient(apiHost, {
    // XXX: We should factor this into some common thing for all actions...
    storage: {
      setAsync(k, v) {
        this[k] = v;
      },
      getAsync(k) {
        return this[k];
      },
    },
  });
  await API.client.setTokenAsync(token);

  let files = await listOfFilesAsync(dir);
  if (files.length === 0) {
    throw new Error('no files in directory');
  }

  let filesToHashes = {};
  await Promise.all(
    files.map(async (filename) => {
      filesToHashes[filename] = await md5Async(path.resolve(dir, filename));
    })
  );

  let countCached = 0;
  let countTotal = files.length;
  let unseenHashes = [];
  for (let i = 0; i < files.length; i++) {
    let hash = filesToHashes[files[i]];
    if (previousHashes[hash]) {
      countCached++;
    } else {
      unseenHashes.push(hash);
    }
  }

  // this is a heuristic for when we should check with the server to see if these files are already uploaded
  // we don't want to do this check every time because it's an extra round trip, but if there are a lot of
  // uncached files it's worth it to check so we don't upload a bunch of unnecessary stuff.
  // right now it checks if less than 70% of the files are known to be cached.
  let serverHashes = {};
  if (countCached / countTotal < 0.7) {
    serverHashes = await testHostedGameHashes(API, {
      hashes: unseenHashes,
    });
  }

  return await _uploadGame(API, {
    gameFiles: files.map((filename) => {
      let hash = filesToHashes[filename];
      if (previousHashes[hash] || serverHashes[hash]) {
        // we know server has already seen this file. don't upload
        return {
          path: filename,
          hash,
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
  name: 'uploadGame',
  fn: uploadGameAsync,
};
