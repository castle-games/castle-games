import * as React from 'react';
import * as ExecNode from '~/common/execnode';
import * as NativeUtil from '~/native/nativeutil';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';

const STYLES_FILE_INPUT = css`
  display: inline-flex;
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

  _nativeChooseFile = async () => {
    // TODO: needs different native open options for images
    const openFilePath = await NativeUtil.chooseOpenProjectPathWithDialogAsync();
    if (openFilePath) {
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
      return null; // flag for now
      return (
        <div>
          <input type="button" value="Choose File" onClick={this._nativeChooseFile} />
        </div>
      );
    }
  }
}
