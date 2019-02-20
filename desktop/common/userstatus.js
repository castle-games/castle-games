import * as Actions from '~/common/actions';
import * as Urls from '~/common/urls';

const USERSTATUS_PING_INTERVAL_SEC = 25;

class UserStatus {
  _game = null;
  _status = null;
  _pingInterval = null;

  _recordUserStatus = async (isNewSession) => {
    const result = await Actions.recordUserStatus(this._status, isNewSession, this._game);
    if (result.errors && result.errors.length) {
      if (result.errors[0].extensions.code === 'LOGIN_REQUIRED') {
        // if the user logged out, don't send any further pings
        this.stop();
      }
    }
  };

  stop = () => {
    if (this._pingInterval) {
      clearInterval(this._pingInterval);
      this._pingInterval = null;
    }
    this._game = null;
    this._status = null;
  };

  startAsync = async (game) => {
    this.stop();
    this._game = game;
    this._status = Urls.isPrivateUrl(game.url) ? 'make' : 'play';
    this._recordUserStatus(true);
    this._pingInterval = setInterval(
      () => this._recordUserStatus(false),
      USERSTATUS_PING_INTERVAL_SEC * 1000
    );
  };
}

export default new UserStatus();
