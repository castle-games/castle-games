import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';

const path = Utilities.path();

import CreateProjectInput from '~/components/create/CreateProjectInput';

const STYLES_PROJECT_INPUT_CONTAINER = css`
  border: 1px solid ${Constants.colors.background4};
  background-color: ${Constants.colors.background};
  border-radius: 4px;
  margin-bottom: 24px;
`;

const STYLES_PROJECT_PATH_CHOOSER = css`
  border-top: 1px solid ${Constants.colors.background4};
  display: flex;
`;

const STYLES_PROJECT_PATH_PREVIEW = css`
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.linescale.lvl5};
  cursor: default;
  width: 100%;
  padding: 8px;
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.base};
  line-height: ${Constants.linescale.base};
  margin-top: 16px;
  margin-bottom: 12px;
`;

const STYLES_PROJECT_DIRECTORY = css`
  color: ${Constants.colors.text};
  font-weight: 700;
`;

const STYLES_PROJECT_FILENAME = css`
  color: #8e8e8e;
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

export default class ProjectConfigureForm extends React.Component {
  static defaultProps = {
    selectedParentDirectoryPath: '',
    selectedProjectName: '',
    selectedDirectoryName: '',
    onSelectDirectory: (directory) => {},
    onChangeProjectName: (e) => {},
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
    let projectFileName = projectDirectoryName ? `${projectDirectoryName}.castle` : '';
    return (
      <div className={STYLES_PROJECT_INPUT_CONTAINER}>
        <CreateProjectInput
          name="projectName"
          value={this.props.selectedProjectName}
          label="Project Name"
          placeholder="Please enter a name for your new project"
          onChange={this.props.onChangeProjectName}
        />
        <div className={STYLES_PROJECT_PATH_CHOOSER}>
          <div className={STYLES_PROJECT_PATH_PREVIEW}>
            <span className={STYLES_PROJECT_DIRECTORY}>{projectParentDirectoryPath}</span>
            <span className={STYLES_PROJECT_FILENAME}>
              {path.sep}
              {projectDirectoryName}
              {path.sep}
              {projectFileName}
            </span>
          </div>
          <div className={STYLES_ACTION} onClick={this._handleChangeDirectory}>
            Change Folder
          </div>
        </div>
      </div>
    );
  }
}
