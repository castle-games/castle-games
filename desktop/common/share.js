import * as Actions from '~/common/actions';
import * as NativeUtil from '~/native/nativeutil';

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

    NativeUtil.sendLuaEvent('CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE', {
      address: response.address,
    });
  };
}

export default new Share();
