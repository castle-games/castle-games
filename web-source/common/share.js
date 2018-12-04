import * as Actions from '~/common/actions';
import * as CEF from '~/common/cef';

class Share {
  addEventListeners = () => {
    window.addEventListener(
      'CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST',
      this._connectMultiplayerClientAsync
    );
  };

  removeEventListeners = () => {
    window.removeEventListener(
      'CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST',
      this._connectMultiplayerClientAsync
    );
  };

  _connectMultiplayerClientAsync = async e => {
    let mediaUrl = e.params.mediaUrl;
    let response = await Actions.multiplayerJoinAsync(mediaUrl);

    CEF.sendLuaEvent('CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE', {
      address: response.address,
    });
  };
}

export default new Share();
