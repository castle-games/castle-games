let ReactNative = require('react-native');

let AsyncStorage = ReactNative.AsyncStorage;

class ReactNativeAsyncStorage {
  constructor(opts) {
    this._opts = { ...opts };
    this._prefix = this._opts.prefix || '$$GhostClient:';
  }

  async setAsync(key, value) {
    await AsyncStorage.setItem(this._prefix + key, JSON.stringify(value));
  }

  async getAsync(key) {
    let jsonValue = await AsyncStorage(this._prefix + key);
    if (jsonValue) {
      return JSON.parse(jsonValue);
    }
  }

  async deleteAsync(key) {
    await _AsyncStorage.deleteAsync(this._prefix + key);
  }
}
