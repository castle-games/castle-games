export default class History {
  _storage;

  constructor(storage) {
    this._storage = storage;
  }
  
  addItem(media) {
    if (!this._storage) {
      alert('History is not supported at the moment.');
      return;
    }

    let data = this._storage.getItem('history');

    // TODO(jim): Sync this with your profile if you're logged in.
    if (!data) {
      console.log('Setting up your local viewing history.');
      this._storage.setItem('history', JSON.stringify({ history: [] }));
    }

    data = this._storage.getItem('history');
    if (!data) {
      alert('History is not supported at the moment.');
      return;
    }

    let { history } = JSON.parse(data);
    if (!history) {
      return;
    }

    if (history.length > 10) {
      history.pop();
    }

    history = history.filter(h => h.mediaUrl !== media.mediaUrl);

    history.unshift(media);
    this._storage.setItem('history', JSON.stringify({ history }));
  };

  getItems() {
    let data, history;
    if (this._storage) {
      try {
        data = this._storage.getItem('history');
      } catch (e) {
        console.log(e);
      }
    }
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        history = parsedData.history;
      } catch (e) {
        console.log(e);
      }
    }
    return history;
  }

  clear() {
    this._storage.setItem('history', JSON.stringify({ history: [] }));
  };
}
