import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';

import UIGameGrid from '~/components/reusable/UIGameGrid';
import UISubmitButton from '~/components/reusable/UISubmitButton';

const path = Utilities.path();

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
`;

const STYLES_SECTION = css`
  padding: 24px 24px 24px 24px;
  width: 50%;
  min-width: 300px;
  max-width: 600px;
`;

const STYLES_FORM_ACTIONS = css`
  display: flex;
  margin-top: 12px;
`;

const STYLES_HEADING = css`
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl5};
  margin-bottom: 16px;
`;

const STYLES_PARAGRAPH = css`
  font-size: ${Constants.typescale.lvl6};
  line-height: ${Constants.linescale.lvl6};
  margin-bottom: 16px;
`;

const STYLES_GAME_PREVIEW_ERROR = css`
  color: ${Constants.colors.error};
  margin: 16px 0 16px 0;
`;

const STYLES_GAME_PREVIEW_ERROR_DETAIL = css`
  font-size: ${Constants.typescale.lvl6};
  border-left: 3px solid ${Constants.colors.background4};
  margin-bottom: 16px;
  padding-left: 16px;
`;

const STYLES_GAME_PREVIEW_URL = css`
  text-decoration: underline;
  cursor: default;
`;

const STYLES_GAME_SOURCE_URL = css`
  border: 1px solid ${Constants.colors.background4};
  background: ${Constants.colors.white};
  padding: 8px;
  margin: 16px 0;
  word-break: break-word;
  cursor: default;
`;

const STYLES_UPDATE_STATUS = css`
  color: ${Constants.colors.text2};
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.linescale.lvl7};
  text-transform: uppercase;
  margin: 8px 0;
`;

export default class UpdateGame extends React.Component {
  static defaultProps = {
    game: null,
    onAfterSave: () => {},
  };

  state = {
    updateError: null,
    isLoadingUpdate: false,
    timeLastUpdated: 0,
  };

  _updateGame = async () => {
    const { game } = this.props;
    let updatedGame, updateError, timeLastUpdated;
    await this.setState({ isLoadingUpdate: true });
    try {
      updatedGame = await Actions.updateGameAtUrl(game.url);
      timeLastUpdated = Date.now();
    } catch (e) {
      updatedGame = {};
      updateError = e.message;
    }
    if (updatedGame && updatedGame.gameId) {
      this.setState({ isLoadingUpdate: false, timeLastUpdated, updateError }, () => {
        this.props.onAfterSave(updatedGame);
      });
    } else {
      this.setState({ updateError, isLoadingUpdate: false });
    }
  };

  _handleClickHelp = () => {
    NativeUtil.openExternalURL(`${Constants.WEB_HOST}/posts/@castle/adding-game-to-castle-profile`);
  };

  _renderUpdateStatus = () => {
    const { isLoadingUpdate, updateError, timeLastUpdated } = this.state;
    if (isLoadingUpdate) {
      return <div className={STYLES_UPDATE_STATUS}>Updating...</div>;
    } else if (updateError) {
      return (
        <React.Fragment>
          <div className={STYLES_GAME_PREVIEW_ERROR}>
            There was a problem syncing data for this game.
          </div>
          <div className={STYLES_GAME_PREVIEW_ERROR_DETAIL}>{updateError}</div>
        </React.Fragment>
      );
    } else if (timeLastUpdated) {
      return <div className={STYLES_UPDATE_STATUS}>Successfully synced data</div>;
    }
  };

  _renderGamePreview = () => {
    if (this.state.isLoadingUpdate) return;
    if (this.props.game) {
      return (
        <div>
          <UIGameGrid gameItems={[this.props.game]} isPreview={true} />
          <div className={STYLES_PARAGRAPH}>
            Your Castle url is{' '}
            <span className={STYLES_GAME_PREVIEW_URL}>
              {Constants.WEB_HOST}/{this.props.game.slug}
            </span>
          </div>
        </div>
      );
    }
  };

  render() {
    const formAction = 'Sync Data';
    const sourceUrl = path.dirname(this.props.game.entryPoint);
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Update {this.props.game.title}</div>
          <div className={STYLES_PARAGRAPH}>
            Castle reads your game's metadata and source code from the following url. Castle
            automatically looks for updates periodically, but if you want to force an update right
            now, click the Sync Data button.
          </div>
          <div className={STYLES_GAME_SOURCE_URL}>{sourceUrl}</div>
          <div className={STYLES_FORM_ACTIONS}>
            <UISubmitButton disabled={!!this.state.isLoadingUpdate} onClick={this._updateGame}>
              {formAction}
            </UISubmitButton>
          </div>
          {this._renderUpdateStatus()}
        </div>
        <div className={STYLES_SECTION}>{this._renderGamePreview()}</div>
      </div>
    );
  }
}
