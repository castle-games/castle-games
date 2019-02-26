import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import Logs from '~/common/logs';
import * as NativeUtil from '~/native/nativeutil';
import UIButton from '~/components/reusable/UIButton';
import UIHeading from '~/components/reusable/UIHeading';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.background4};
  padding: 16px 16px 32px 16px;
`;

const STYLES_ACTIONS = css`
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
`;

const STYLES_ACTION = css`
  max-width: 400px;
  margin-right: 16px;
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.base};
  line-height: ${Constants.linescale.base};
  margin-top: 16px;
  margin-bottom: 12px;
`;

const STYLES_BUTTON_CONTAINER = css`
  margin-top: 24px;
`;

const STYLES_HELP_GLYPH = css`
  display: inline-block;
  vertical-align: top;
  margin: 0 12px 0 0;
  font-size: 12px;
`;

const STYLES_HELP_ACTION = css`
  cursor: pointer;
  font-family: ${Constants.font.mono};
  color: ${Constants.colors.action};
  line-height: ${Constants.linescale.lvl7};
  font-size: ${Constants.typescale.lvl7};
  padding: 6px 0 2px 4px;
`;

const STYLES_HELP_LABEL = css`
  text-transform: uppercase;
  text-decoration: underline;
`;

export default class HomeMakeBanner extends React.Component {
  static defaultProps = {
    navigateToGameUrl: async (url) => {},
  };

  _handleClickExamples = () => {
    NativeUtil.openExternalURL(`${Constants.WEB_HOST}/examples`);
  };

  _handleClickDiscord = () => {
    NativeUtil.openExternalURL('https://discordapp.com/invite/4C7yEEC');
  };

  _handleClickTutorial = () => {
    NativeUtil.openExternalURL(`${Constants.WEB_HOST}/documentation`);
  };

  _handleCreateProject = async () => {
    const newProjectDirectory = await NativeUtil.chooseDirectoryWithDialogAsync({
      title: 'Create a New Castle Project',
      message: 'Choose a folder where the project will be created.',
      action: 'Create Project',
    });
    if (newProjectDirectory) {
      let entryPointFilePath;
      try {
        entryPointFilePath = await NativeUtil.createProjectAtPathAsync(newProjectDirectory);
      } catch (_) {}
      if (entryPointFilePath) {
        const gameUrl = `file://${entryPointFilePath}`;
        await this.props.navigateToGameUrl(gameUrl);
        Logs.system('Welcome to Castle!');
        Logs.system(`We created your project at ${gameUrl}.`);
        Logs.system(`Open that file in your favorite text editor to get started.`);
        Logs.system(`Need help? Check out ${Constants.WEB_HOST}/documentation`);
      }
    }
  };
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIHeading>Make a Game</UIHeading>
        <div className={STYLES_ACTIONS}>
          <div className={STYLES_ACTION}>
            <p className={STYLES_PARAGRAPH}>
              Click this button to create a new minimal Castle project and start tinkering.
            </p>
            <div className={STYLES_BUTTON_CONTAINER}>
              <UIButton onClick={this._handleCreateProject}>Create a Castle Project</UIButton>
            </div>
          </div>
          <div className={STYLES_ACTION}>
            <p className={STYLES_PARAGRAPH}>Need help, or just want to chat with other Castlers?</p>
            <div onClick={this._handleClickTutorial} className={STYLES_HELP_ACTION}>
              <div className={STYLES_HELP_GLYPH}>&gt;</div>
              <span className={STYLES_HELP_LABEL}>Read our Tutorial</span>
            </div>
            <div onClick={this._handleClickExamples} className={STYLES_HELP_ACTION}>
              <div className={STYLES_HELP_GLYPH}>&gt;</div>
              <span className={STYLES_HELP_LABEL}>View Example Projects</span>
            </div>
            <div onClick={this._handleClickDiscord} className={STYLES_HELP_ACTION}>
              <div className={STYLES_HELP_GLYPH}>&gt;</div>
              <span className={STYLES_HELP_LABEL}>Join Discord</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
