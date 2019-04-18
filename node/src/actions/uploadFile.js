let fs = require('fs');
let CastleApiClient = require('castle-api-client');
let FormData = require('form-data');

global.FormData = FormData;
global.Blob = fs.ReadStream;

function getBlobForFilename(filename) {
  let f = fs.createReadStream(filename);
  f.__proto__ = Blob.prototype;
  return f;
}

async function uploadFile(API, { file }) {
  const variables = { file };
  const result = await API.graphqlAsync({
    query: `
      mutation($file: Upload!) {
        uploadFile(file: $file) {
          fileId
          width
          height
          url
        }
      }
    `,
    variables,
  });

  if (result.error || result.errors || !result.data) {
    throw new Error('failed to upload file: ' + JSON.stringify(result));
  }

  return result.data.uploadFile;
}

async function uploadFileAsync(args) {
  let path = args.path;
  let apiHost = args.apiHost;
  let token = args.token;

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

  return await uploadFile(API, {
    file: getBlobForFilename(path),
  });
}

module.exports = {
  name: 'uploadFile',
  fn: uploadFileAsync,
};
