class BrowserLocalStorage {
  constructor(opts) {
    this._opts = Object.assign({}, opts);
    this._localStorage = this._opts.localStorage || localStorage;
    this._prefix = this._opts.prefix || '__CastleApiClient-';
  }

  async setAsync(key, value) {
    this._localStorage.setItem(this._prefix + key, JSON.stringify(value));
  }

  async getAsync(key) {
    let jsonValue = this._localStorage.getItem(this._prefix + key);
    if (jsonValue) {
      return JSON.parse(jsonValue);
    }
  }

  async deleteAsync(key) {
    this._localStorage.removeItem(this._prefix + key);
  }
}

module.exports = BrowserLocalStorage;
