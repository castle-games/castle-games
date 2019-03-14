import * as Actions from '~/common/actions';
import * as NativeUtil from '~/native/nativeutil';

class Share {
  addEventListeners = (game) => {
    window.addEventListener(
      'CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST',
      this._connectMultiplayerClientAsync
    );

    this._game = game;
    this._sessionId = game ? game.sessionId : null;
  };

  removeEventListeners = () => {
    window.removeEventListener(
      'CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST',
      this._connectMultiplayerClientAsync
    );

    this._game = null;
    this._sessionId = null;
  };

  _connectMultiplayerClientAsync = async (e) => {
    let mediaUrl = e.params.mediaUrl;
    let entryPoint = mediaUrl;
    if (this._game && this._game.serverEntryPoint) {
      entryPoint = this._game.serverEntryPoint;
    }

    let response = await Actions.multiplayerJoinAsync(
      this._game ? this._game.gameId : null,
      entryPoint,
      this._sessionId
    );

    NativeUtil.sendLuaEvent('CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE', {
      address: response.address,
    });

    if (response.sessionId && this._game) {
      let gameTitle = this._game.title || 'Untitled';
      let verb = response.isNewSession ? 'created' : 'joined';
      let message = `You ${verb} a session of ${gameTitle}. Share this link to invite other people: ${
        this._game.url
      }#${response.sessionId}`;

      let event = new Event('CASTLE_ADD_CHAT_NOTIFICATION');
      event.params = {
        message,
      };
      window.dispatchEvent(event);
    }
  };
}

export default new Share();
