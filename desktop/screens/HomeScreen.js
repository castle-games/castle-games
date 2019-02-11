import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import { css } from 'react-emotion';

import Logs from '~/common/logs';
import { NavigationContext } from '~/contexts/NavigationContext';
import UIButton from '~/components/reusable/UIButton';
import UIGameGrid from '~/components/reusable/UIGameGrid';
import UIHeading from '~/components/reusable/UIHeading';

const MAX_NUM_FEATURED_GAMES = 16;

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  background: ${Constants.colors.background};
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
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

const STYLES_ACTIONS = css`
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
`;

const STYLES_ACTION = css`
  max-width: 400px;
  margin-right: 16px;
`;

const STYLES_SECTION = css`
  padding: 16px 16px 32px 16px;
`;

const STYLES_SECTION_DARK = css`
  background: ${Constants.colors.background4};
  padding: 16px 16px 32px 16px;
`;

const STYLES_HELP_GLYPH = css`
  display: inline-block;
  vertical-align: top;
  margin: 0 12px 0 0;
  font-size: 12px;
`;

const STYLES_HELP_ACTION = css`
  cursor: pointer;
  font: ${Constants.font.mono};
  color: ${Constants.colors.action};
  line-height: 1.5rem;
  font-size: ${Constants.typescale.lvl7};
  padding: 6px 0 2px 4px;
`;

const STYLES_HELP_LABEL = css`
  text-transform: uppercase;
  text-decoration: underline;
`;

export default class HomeScreen extends React.Component {
  static defaultProps = {
    featuredGames: [],
  };
  static contextType = NavigationContext;

  _handleClickExamples = () => {
    NativeUtil.openExternalURL('http://www.playcastle.io/examples');
  };

  _handleClickDiscord = () => {
    NativeUtil.openExternalURL('https://discordapp.com/invite/4C7yEEC');
  };

  _handleClickTutorial = () => {
    NativeUtil.openExternalURL('http://www.playcastle.io/get-started');
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
        await this.context.navigateToGameUrl(gameUrl);
        Logs.system('Welcome to Castle!');
        Logs.system(`We created your project at ${gameUrl}.`);
        Logs.system(`Open that file in your favorite text editor to get started.`);
        Logs.system(`Need help? Check out http://www.playcastle.io/get-started`);
      }
    }
  };

  _getFeaturedGames = () => {
    const { featuredGames } = this.props;
    let result;
    if (featuredGames) {
      result = featuredGames;
      if (result.length > MAX_NUM_FEATURED_GAMES) {
        result = result.slice(0, MAX_NUM_FEATURED_GAMES);
      }
    }
    return result;
  };

  render() {
    const featuredGames = this._getFeaturedGames();

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION_DARK}>
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
              <p className={STYLES_PARAGRAPH}>
                Need help, or just want to chat with other Castlers?
              </p>
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
        <div className={STYLES_SECTION}>
          <UIHeading>Play Games</UIHeading>
          <div>
            <UIGameGrid
              gameItems={featuredGames}
              onUserSelect={this.context.naviateToUserProfile}
              onGameSelect={this.context.navigateToGame}
            />
          </div>
        </div>
      </div>
    );
  }
}
