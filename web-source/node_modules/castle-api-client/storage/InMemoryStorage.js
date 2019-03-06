class InMemoryStorage {
  constructor(opts) {
    this._opts = Object.assign({}, opts);
    this._store = {};
  }

  async setAsync(key, value) {
    this._store[key] = value;
  }

  async getAsync(key) {
    return this._store[key];
  }

  async deleteAsync(key) {
    delete this._store[key];
  }
}

module.exports = InMemoryStorage;
