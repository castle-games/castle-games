let apolloFetch = require('apollo-fetch');
let extractFiles = require('extract-files');

let Storage = require('./Storage');

let PRODUCTION_API_URL = 'https://ghost-server.app.render.com';

// This code based on the code here by @jaydenseric
// https://github.com/jaydenseric/apollo-upload-client/blob/master/src/index.js
function constructUploadOptions(requestOrRequests, options) {
  let files = extractFiles.extractFiles(requestOrRequests);

  if (files.length) {
    if (typeof FormData === 'undefined') {
      throw new Error('Environment must support FormData to upload files.');
    }

    options.method = 'POST';

    // Automatically set by fetch when the body is a FormData instance.
    delete options.headers['content-type'];

    // GraphQL multipart request spec:
    // https://github.com/jaydenseric/graphql-multipart-request-spec
    options.body = new FormData();
    options.body.append('operations', JSON.stringify(requestOrRequests));
    options.body.append(
      'map',
      JSON.stringify(
        files.reduce((map, { path }, index) => {
          map[`${index}`] = [path];
          return map;
        }, {})
      )
    );
    files.forEach(({ file }, index) => options.body.append(index, file, file.name));
    return options;
  } else {
    return apolloFetch.constructDefaultOptions(requestOrRequests, options);
  }
}

class CastleApiClient {
  constructor(baseUrl, opts) {
    this.url = baseUrl || PRODUCTION_API_URL;
    this.opts = Object.assign({}, opts);
    this._storage = this.opts.storage || new Storage();
    this._apolloFetch = apolloFetch.createApolloFetch({
      uri: this.url + '/graphql',
      constructOptions: constructUploadOptions,
    });

    // Add auth header
    this._apolloFetch.use(async ({ request, options }, next) => {
      options.headers = options.headers || {};
      Object.assign(options.headers, await this._getRequestHeadersAsync());
      next();
    });
  }

  _makeClientId() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    let t = 'cid:';
    for (let i = 0; i < 16; i++) {
      t += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return t;
  }

  async getClientIdAsync() {
    let clientId = await this._storage.getAsync('clientId');
    if (!clientId) {
      clientId = await this.newSessionAsync();
    }
    return clientId;
  }

  async _getRequestHeadersAsync() {
    let headers = {};
    headers['X-ClientId'] = await this.getClientIdAsync();
    return headers;
  }

  async graphqlAsync(...args) {
    return await this._apolloFetch(...args);
  }

  async _getSessionsAsync() {
    let sessions = await this._storage.getAsync('sessions');
    if (typeof sessions !== 'object' || Array.isArray(sessions)) {
      sessions = {};
    }
    return sessions;
  }

  async newSessionAsync() {
    let clientId = this._makeClientId();
    await this.setSessionAsync(clientId);
    return clientId;
  }

  async rememberSessionAsync(clientId) {
    let sessions = await this._getSessionsAsync();
    sessions[clientId] = true;
    await this._storage.setAsync('sessions', sessions);
    return Object.keys(sessions);
  }

  async forgetSessionAsync(clientId) {
    let sessions = await this._getSessionsAsync();
    delete sessions[clientId];
    await this._storage.setAsync('sessions', sessions);

    // If this is our current clientId, then stop using it
    // if we are trying to forget it
    if (clientId === (await this.getClientIdAsync())) {
      await this._storage.deleteAsync('clientId');
    }

    return Object.keys(sessions);
  }

  async forgetAllSessionsAsync() {
    await this._storage.deleteAsync('sessions');
    await this._storage.deleteAsync('clientId');
    return [];
  }

  async getAllSessionsAsync() {
    let sessions = await this._getSessionsAsync();
    return Object.keys(sessions);
  }

  async setSessionAsync(clientId) {
    // Don't try to do these in parallel because there are
    // race conditions in some of the Storage implementations
    // (ex. the FileSystemStorage especially)
    await this.rememberSessionAsync(clientId);
    await this._storage.setAsync('clientId', clientId);
  }
}

module.exports = (...args) => {
  let client = new CastleApiClient(...args);
  let f = async (...graphqlArgs) => {
    // Let the caller use positional arguments
    if (typeof graphqlArgs[0] === 'string') {
      let [query, variables, operationName] = graphqlArgs;
      graphqlArgs = [
        {
          query,
          variables,
          operationName,
        },
      ];
    }

    return await client.graphqlAsync(...graphqlArgs);
  };
  f.graphqlAsync = f;
  f.client = client;
  return f;
};

Object.assign(module.exports, {
  CastleApiClient,
  Storage,
  PRODUCTION_API_URL,
});
