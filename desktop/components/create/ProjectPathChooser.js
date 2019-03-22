import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

const STYLES_PROJECT_PATH_PREVIEW = css`
  border: 1px solid ${Constants.colors.background4};
  padding: 8px;
  cursor: default;
`;

const STYLES_PROJECT_DIRECTORY = css`
  font-weight: 700;
  color: ${Constants.colors.text};
`;

const STYLES_PROJECT_FILENAME = css`
  color: #8e8e8e;
`;

const STYLES_ACTION = css`
  font-size: ${Constants.typescale.lvl6};
  line-height: ${Constants.linescale.lvl5};
  color: ${Constants.colors.action};
  font-family: ${Constants.font.mono};
  text-decoration: underline;
  text-transform: uppercase;
  word-spacing: -0.2rem;
  cursor: pointer;
`;

export default class ProjectPathChooser extends React.Component {
  static defaultProps = {
    selectedParentDirectoryPath: '',
    selectedDirectoryName: '',
    onSelectDirectory: (directory) => {},
  };

  _handleChangeDirectory = async () => {
    const newProjectDirectory = await NativeUtil.chooseDirectoryWithDialogAsync({
      title: 'Create a New Castle Project',
      message: 'Choose a folder where the project will be created.',
      action: 'Select Folder',
    });
    this.props.onSelectDirectory(newProjectDirectory);
  };

  render() {
    let projectParentDirectoryPath = this.props.selectedParentDirectoryPath;
    let projectDirectoryName = this.props.selectedDirectoryName;
    let projectFileName = 'project.castle';
    return (
      <React.Fragment>
        <div className={STYLES_PROJECT_PATH_PREVIEW}>
          <span className={STYLES_PROJECT_DIRECTORY}>{projectParentDirectoryPath}</span>
          <span className={STYLES_PROJECT_FILENAME}>
            /{projectDirectoryName}/{projectFileName}
          </span>
        </div>
        <div className={STYLES_ACTION} onClick={this._handleChangeDirectory}>
          Change Folder
        </div>
      </React.Fragment>
    );
  }
}
