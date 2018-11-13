import * as Actions from '~/common/actions';
import * as Urls from '~/common/urls';

const USERPLAY_PING_INTERVAL_SEC = 25;

class UserPlay {
  _currentUserplayId = null;
  _currentUserplayPingInterval = null;

  stopAsync = async () => {
    if (this._currentUserplayId) {
      await Actions.recordUserplayEndAsync(this._currentUserplayId);
      this._currentUserplayId = null;
    }
    if (this._currentUserplayPingInterval) {
      clearInterval(this._currentUserplayPingInterval);
      this._currentUserplayPingInterval = null;
    }
  };

  startAsync = async ({ mediaUrl, mediaId }) => {
    await this.stopAsync();
    if (!Urls.isLocalUrl(mediaUrl)) {
      let result = await Actions.recordUserplayStartAsync(mediaUrl, mediaId);
      if (result && result.data && result.data.recordUserplayStart) {
        this._currentUserplayId = result.data.recordUserplayStart.userplayId;

        this._currentUserplayPingInterval = setInterval(
          () => {
            if (this._currentUserplayId) {
              Actions.recordUserplayPingAsync(this._currentUserplayId);
            }
          },
          USERPLAY_PING_INTERVAL_SEC * 1000
        );
      }
    }
  }
}

export default new UserPlay();
