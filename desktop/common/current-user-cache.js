const STORAGE_KEY = 'current-user';

class CurrentUserCache {
  _storage;

  setStorage(storage) {
    this._storage = storage;
    let data = this._storage.getItem(STORAGE_KEY);
    if (!data) {
      this._storage.setItem(STORAGE_KEY, JSON.stringify({}));
    }
  }

  set(currentUser) {
    if (!this._storage) {
      console.warn(`Can't read current user cache: no local storage`);
      return false;
    }
    if (!currentUser) {
      console.warn(`Can't cache current user: invalid data ${JSON.stringify(currentUser)}`);
      return false;
    }

    this._storage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    return true;
  }

  get() {
    if (!this._storage) {
      console.warn(`Can't read current user cache: no local storage`);
      return false;
    }

    let currentUser;
    try {
      let data = this._storage.getItem(STORAGE_KEY);
      currentUser = JSON.parse(data);
    } catch (e) {
      console.warn(`Error reading current user cache: ${e}`);
    }
    if (!currentUser) {
      return {};
    }
    return currentUser;
  }

  clear() {
    this.set({});
  }
}

export default new CurrentUserCache();
