export default class StorageHandler {
  _storageBackend;
  _namespace;
  _keySeparator;

  constructor(namespace, keySeparator) {
    this._namespace = namespace || '';
    this._keySeparator = keySeparator || '.';
    this._storageBackend = window.localstorage;
  }

  getItem(key) {
    try {
      return this.storageBackend.getItem(this._getKey(key));
    } catch (e) {
      console.warn('error: get local storage: ', key);
    }
  }

  removeItem(key) {
    try {
      this.storageBackend.removeItem(this._getKey(key));
    } catch (e) {
      console.warn('error: remove local storage: ', key);
    }
  }

  setItem(key, value, options) {
    try {
      this.storageBackend.setItem(this._getKey(key), value, options);
    } catch (e) {
      console.warn('error: set local storage: ', key);
    }
  }

  _getKey(key) {
    return `${this._namespace}${this._keySeparator}${key}`;
  }

  get storageBackend() {
    if (this._storageBackend) {
      return this._storageBackend;
    }

    this._storageBackend = window.localStorage;
    return this._storageBackend;
  }

  set storageBackend(storageBackend) {
    this._storageBackend = storageBackend;
  }
}
