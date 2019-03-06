let fs = require('fs');
let path = require('path');

class FileSystemStorage {
  constructor(opts) {
    this._opts = { ...opts };
    this._file = this._opts.file || path.join(process.env.HOME, '.castle-api.json');
  }

  _writeFileAsync(...args) {
    return new Promise((resolve, reject) => {
      fs.writeFile(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  _readFileAsync(...args) {
    return new Promise((resolve, reject) => {
      fs.readFile(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async _getStoreAsync() {
    try {
      let storeJson = await this._readFileAsync(this._file, 'utf8');
      return JSON.parse(storeJson);
    } catch (e) {
      return {};
    }
  }

  async _writeStoreAsync(store) {
    let storeJson = JSON.stringify(store);
    await this._writeFileAsync(this._file, storeJson, 'utf8');
  }

  async setAsync(key, value) {
    let store = await this._getStoreAsync();
    store[key] = value;
    await this._writeStoreAsync(store);
  }

  async getAsync(key) {
    let store = await this._getStoreAsync();
    return store[key];
  }

  async deleteAsync(key) {
    let store = await this._getStoreAsync();
    delete store[key];
    await this._writeStoreAsync(store);
  }
}

module.exports = FileSystemStorage;
