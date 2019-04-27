import { NativeBinds } from '~/native/nativebinds';
import UserStatus from '~/common/userstatus';
import Share from '~/common/share';

class GameWindow {
  _isOpen = false;
  _currentGame = null;
  _navigations = null;

  open = async ({ gameUrl, game, navigations }) => {
    if (this._isOpen) return;
    this._isOpen = true;
    this._currentGame = game;
    this._navigations = navigations;
    amplitude.getInstance().logEvent('OPEN_LUA', {
      gameUrl,
    });
    Share.addEventListeners(game);
    UserStatus.startAsync(game);
    await NativeBinds.openUri({ uri: gameUrl });
  };

  setVisible = async (isVisible) => {
    if (!this._isOpen) return;
    await NativeBinds.setWindowFrameVisible({ isVisible });
  };

  updateFrame = async (rect) => {
    // NOTE: Don't need `this._isOpen` to be true here -- native keeps track of early updates...
    await NativeBinds.setChildWindowFrame({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
  };

  close = async () => {
    if (this._isOpen) {
      UserStatus.stop();
      Share.removeEventListeners();
      await NativeBinds.close();
      this._isOpen = false;
      this._currentGame = null;
      this._navigations = null;
    }
  };

  getCurrentGame = () => {
    return this._isOpen ? this._currentGame : null;
  }

  getNavigations = () => {
    return this._navigations;
  }
}

export default new GameWindow();
