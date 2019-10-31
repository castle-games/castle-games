import * as React from 'react';
import * as ExecNode from '~/common/execnode';
import * as NativeUtil from '~/native/nativeutil';
import * as Strings from '~/common/strings';
import * as Utilities from '~/common/utilities';

const path = Utilities.path();

import { css } from 'react-emotion';

const STYLES_FILE_INPUT = css`
  display: inline-flex;
`;

const STYLES_CHOSEN_IMAGE_FILENAME = css`
  margin: 0;
  padding: 0 8px;
  font-size: 12px;
  user-select: none;
`;

/*
// this component either exposes a web file input:
//   <input type="file" ... />
//
// or it exposes a react component that does the same thing
// using NativeBinds and ExecNode.
//
// the later case is used on macOS catalina where Chromium has issues with NSOpenPanel.
*/

export default class UIFileInput extends React.Component {
  static defaultProps = {
    useWebFileInput: true,
    onWebInputChange: () => {}, // the onChange() callback for only <input type="file" />
    onNativeFileUploadStarted: () => {},
    onNativeFileUploadFinished: (success, file) => {},
  };

  state = {
    chosenFilename: null,
  };

  _nativeChooseFile = async () => {
    const openFilePath = await NativeUtil.chooseImagePathWithDialogAsync();
    if (openFilePath && !Strings.isEmpty(openFilePath)) {
      this.setState({ chosenFilename: path.basename(openFilePath) });
      let success = false;
      this.props.onNativeFileUploadStarted();
      try {
        const result = await ExecNode.uploadFileAsync(openFilePath, {});
        if (result && result.fileId) {
          this.props.onNativeFileUploadFinished(true, result);
          success = true;
        }
      } catch (e) {}
      if (!success) {
        this.props.onNativeFileUploadFinished(false, null);
      }
    }
  };

  _renderWebFileInput = () => {
    const inputClass = Utilities.isWindows() ? null : STYLES_FILE_INPUT;
    return (
      <input
        type="file"
        className={inputClass}
        onChange={this.props.onWebInputChange}
        {...this.props}
      />
    );
  };

  render() {
    const { useWebFileInput } = this.props;
    if (useWebFileInput) {
      return this._renderWebFileInput();
    } else {
      if (Utilities.isWindows()) {
        console.warn(`Custom file input is not implemented on Windows`);
        return null;
      }
      const label = this.state.chosenFilename ? this.state.chosenFilename : 'No file chosen';
      return (
        <div className={STYLES_FILE_INPUT} {...this.props}>
          <input type="button" value="Choose File" onClick={this._nativeChooseFile} />
          <p className={STYLES_CHOSEN_IMAGE_FILENAME}>{label}</p>
        </div>
      );
    }
  }
}
