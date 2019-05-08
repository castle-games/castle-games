const STORAGE_KEY = 'publish-history';

// maintains a local association of project ids to local directories from which
// they have been published.
class PublishHistory {
  _storage;

  setStorage(storage) {
    this._storage = storage;
    let data = this._storage.getItem(STORAGE_KEY);
    if (!data) {
      this._storage.setItem(STORAGE_KEY, JSON.stringify({ publishHistory: {} }));
    }
  }

  addItem(gameId, localPath) {
    if (!this._storage) {
      console.warn(`Can't read publish history: no local storage`);
      return false;
    }
    if (!gameId || !localPath || !localPath.length) {
      console.warn(`Can't add publish history: invalid pair (${gameId}, ${localPath})`);
      return false;
    }

    let data = this._storage.getItem(STORAGE_KEY);
    let { publishHistory } = JSON.parse(data);
    if (!publishHistory) {
      return null;
    }
    let item = publishHistory[gameId];
    if (!item) {
      item = {};
    }
    item.localPath = localPath;
    publishHistory[gameId] = item;
    this._storage.setItem(STORAGE_KEY, JSON.stringify({ publishHistory }));
    return true;
  }

  getItem(gameId) {
    if (!this._storage) {
      console.warn(`Can't read publish history: no local storage`);
      return false;
    }

    let data = this._storage.getItem(STORAGE_KEY);
    let { publishHistory } = JSON.parse(data);
    if (!publishHistory) {
      return null;
    }
    return publishHistory[gameId];
  }
}

export default new PublishHistory();
