import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  border: 1px solid ${Constants.colors.background4};
  display: flex;
  border-radius: 4px;
`;

const STYLES_PROJECT_PATH_PREVIEW = css`
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.linescale.lvl5};
  cursor: default;
  width: 100%;
  padding: 8px;
`;

const STYLES_PROJECT_DIRECTORY = css`
  color: ${Constants.colors.text};
  font-weight: 700;
  line-height: ${Constants.linescale.lvl3};
`;

const STYLES_ACTION = css`
  border-left: 1px solid ${Constants.colors.background4};
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.linescale.lvl5};
  color: ${Constants.colors.action};
  font-family: ${Constants.font.mono};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  flex-shrink: 0;
  text-decoration: underline;
  text-transform: uppercase;
  word-spacing: -0.2rem;
  cursor: pointer;
`;

const UIDirectoryChooser = ({
  value = null,
  placeholder = '',
  title = 'Choose a folder',
  message = 'Choose a folder',
  action = 'Select Folder',
  onChange =  (directory) => {},
}) => {
  const _handleChangeDirectory = async () => {
    const directory = await NativeUtil.chooseDirectoryWithDialogAsync({
      title,
      message,
      action,
    });
    onChange(directory);
  };

  let changeAction, valueToDisplay, valueStyle;
  if (value) {
    changeAction = 'Change Folder';
    valueToDisplay = value;
  } else {
    changeAction = 'Choose Folder';
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
      <div className={STYLES_ACTION} onClick={_handleChangeDirectory}>
        {changeAction}
      </div>
    </div>
  );
}

export default UIDirectoryChooser;
