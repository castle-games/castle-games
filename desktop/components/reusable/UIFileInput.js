import * as React from 'react';
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
      return null;
    }
  }
}
