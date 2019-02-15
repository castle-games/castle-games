import * as Actions from '~/common/actions';
import * as Urls from '~/common/urls';

const USERSTATUS_PING_INTERVAL_SEC = 25;

class UserStatus {
  _game = null;
  _status = null;
  _pingInterval = null;

  stopAsync = async () => {
    if (this._pingInterval) {
      clearInterval(this._pingInterval);
      this._pingInterval = null;
    }
    this._game = null;
    this._status = null;
  };

  startAsync = async (game) => {
    await this.stopAsync();
    this._game = game;
    this._status = Urls.isPrivateUrl(game.url) ? 'make' : 'play';
    Actions.recordUserStatus(this._status, true, this._game);
    this._pingInterval = setInterval(
      () => Actions.recordUserStatus(this._status, false, this._game),
      USERSTATUS_PING_INTERVAL_SEC * 1000
    );
  };
}

export default new UserStatus();
