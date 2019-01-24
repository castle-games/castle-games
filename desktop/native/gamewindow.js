import { NativeBinds } from '~/native/nativebinds';

class GameWindow {
  _isOpen = false;

  open = async (mediaUrl) => {
    if (this._isOpen) return;
    this._isOpen = true;
    await NativeBinds.openUri({ uri: mediaUrl });
  };

  setVisible = async (isVisible) => {
    if (!this._isOpen) return;
    await NativeBinds.setWindowFrameVisible({ isVisible });
  };

  updateFrame = async (rect) => {
    if (!this._isOpen) return;
    await NativeBinds.setChildWindowFrame({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
  };

  close = async () => {
    if (this._isOpen) {
      await NativeBinds.close();
      this._isOpen = false;
    }
  };
}

export default new GameWindow();
