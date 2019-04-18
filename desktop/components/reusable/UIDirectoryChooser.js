import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: flex;
  border: 1px solid ${Constants.colors.background4};
  border-radius: 4px;
`;

const STYLES_PROJECT_PATH_PREVIEW = css`
  cursor: default;
  width: 100%;
  padding: 8px;
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.linescale.lvl5};
`;

const STYLES_PROJECT_DIRECTORY = css`
  font-weight: 700;
  color: ${Constants.colors.text};
`;

const STYLES_ACTION = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid ${Constants.colors.background4};
  padding: 8px;
  flex-shrink: 0;
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.linescale.lvl5};
  color: ${Constants.colors.action};
  font-family: ${Constants.font.mono};
  text-decoration: underline;
  text-transform: uppercase;
  word-spacing: -0.2rem;
  cursor: pointer;
`;

export default class UIDirectoryChooser extends React.Component {
  static defaultProps = {
    value: null,
    placeholder: '',
    title: 'Choose a folder',
    message: 'Choose a folder',
    action: 'Select Folder',
    onChange: (directory) => {},
  };

  _handleChangeDirectory = async () => {
    let { title, message, action } = this.props;
    const directory = await NativeUtil.chooseDirectoryWithDialogAsync({
      title,
      message,
      action,
    });
    this.props.onChange(directory);
  };

  render() {
    const { value, placeholder } = this.props;
    let action, valueToDisplay, valueStyle;
    if (value) {
      action = 'Change Folder';
      valueToDisplay = value;
    } else {
      action = 'Choose Folder';
      valueToDisplay = placeholder;
      valueStyle = { color: '#8e8e8e' };
    }
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_PROJECT_PATH_PREVIEW}>
          <span className={STYLES_PROJECT_DIRECTORY} style={valueStyle}>
            {valueToDisplay}
          </span>
        </div>
        <div className={STYLES_ACTION} onClick={this._handleChangeDirectory}>
          {action}
        </div>
      </div>
    );
  }
}
