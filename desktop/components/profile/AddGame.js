import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as ExecNode from '~/common/execnode';
import * as NativeUtil from '~/native/nativeutil';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';

import PublishGamePreview from '~/components/profile/PublishGamePreview';
import UIDirectoryChooser from '~/components/reusable/UIDirectoryChooser';
import UIInputSecondary from '~/components/reusable/UIInputSecondary';
import UISubmitButton from '~/components/reusable/UISubmitButton';

import PublishHistory from '~/common/publish-history';

const path = Utilities.path();

const STYLES_CONTAINER = css`
  display: flex;
  padding-top: 24px;
`;

const STYLES_CONTENT = css`
  padding: 0 40px 0 24px;
  width: 100%;
  min-width: 300px;
`;

const STYLES_HELP = css`
  width: 256px;
  flex-shrink: 0;
  padding-right: 24px;
`;

const STYLES_FORM_ACTIONS = css`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const STYLES_HEADING = css`
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl4};
  margin-bottom: 16px;
`;

const STYLES_SECONDARY_ACTION = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: underline;
  font-size: ${Constants.typescale.lvl6};
  color: ${Constants.colors.text};
  cursor: pointer;
`;

const STYLES_PARAGRAPH = css`
  font-size: ${Constants.typescale.lvl6};
  line-height: ${Constants.linescale.lvl6};
  margin-bottom: 24px;
`;

const STYLES_LINK = css`
  color: ${Constants.colors.action};
  text-decoration: underline;
  cursor: pointer;
`;

export default class AddGame extends React.Component {
  static defaultProps = {
    game: null,
    onAfterSave: null,
  };

  state = {
    hostingType: 'castle', // castle (upload to castle) or external (host elsewhere)
    directoryInputValue: '',
    externalUrlInputValue: '',
    previewedGame: {
      slug: null,
    },
    previewError: null,
    isLoadingPreview: false,
    isLoadingSubmit: false,
  };
  _debouncePreviewTimeout = null;

  componentDidMount() {
    this._resetForm();
  }

  componentDidUpdate(prevProps) {
    if (this.props.game !== prevProps.game) {
      this._resetForm();
    }
  }

  _getDefaultValues = () => {
    const { game } = this.props;
    let lastUploadDirectoryForGame;
    if (game) {
      let history = PublishHistory.getItem(game.gameId);
      lastUploadDirectoryForGame = history ? history.localPath : null;
    }
    return {
      hostingType: game && !game.isCastleHosted ? 'external' : 'castle',
      directoryInputValue: game && game.isCastleHosted ? lastUploadDirectoryForGame : '',
      externalUrlInputValue: game && !game.isCastleHosted ? game.sourceUrl : '',
    };
  };

  _resetForm = () => {
    let defaults = this._getDefaultValues();
    this.setState({
      hostingType: defaults.hostingType,
      directoryInputValue: defaults.directoryInputValue,
      externalUrlInputValue: defaults.externalUrlInputValue,
      previewedGame: {
        slug: null,
      },
      previewError: null,
      isLoadingPreview: false,
    });
    if (this.props.game) {
      this._debounceUpdateGamePreview();
    }
  };

  _debounceUpdateGamePreview = () => {
    if (this._debouncePreviewTimeout) {
      clearTimeout(this._debouncePreviewTimeout);
    }
    this._debouncePreviewTimeout = setTimeout(this._updateGamePreview, 300);
  };

  _previewGameAtLocalPath = async (localPath, gameId) => {
    let previewedGame;
    let projectFilename = await ExecNode.getProjectFilenameAtPathAsync(localPath);
    if (!projectFilename) {
      throw new Error(
        'Unable to find a Castle project in this folder. Make sure to choose a folder that contains a .castle file.'
      );
    }
    const castleFileContents = await NativeUtil.readFile(path.join(localPath, projectFilename));
    return Actions.previewLocalGame(castleFileContents, gameId);
  };

  _updateGamePreview = async () => {
    if (this._debouncePreviewTimeout) {
      clearTimeout(this._debouncePreviewTimeout);
    }
    this._debouncePreviewTimeout = null;

    const { externalUrlInputValue, directoryInputValue } = this.state;
    const gameId = this.props.game ? this.props.game.gameId : null;
    const { hostingType } = this.state;
    let previewedGame = {};
    let previewError = null;
    if (hostingType === 'external' && externalUrlInputValue && externalUrlInputValue.length) {
      await this.setState({ isLoadingPreview: true });
      try {
        previewedGame = await Actions.previewGameAtUrl(externalUrlInputValue, gameId);
      } catch (e) {
        previewedGame = {};
        previewError = e.message;
      }
    } else if (hostingType === 'castle' && directoryInputValue && directoryInputValue.length) {
      await this.setState({ isLoadingPreview: true });
      try {
        previewedGame = await this._previewGameAtLocalPath(directoryInputValue, gameId);
      } catch (e) {
        previewedGame = {};
        previewError = e.message;
      }
    }
    this.setState({ previewedGame, previewError, isLoadingPreview: false });
  };

  _handleChangeExternalUrl = (e) => {
    this.setState({ externalUrlInputValue: e.target.value }, this._debounceUpdateGamePreview);
  };

  _handleChangeDirectory = (directoryInputValue) => {
    this.setState({ directoryInputValue }, this._debounceUpdateGamePreview);
  };

  _isFormSubmittable = () => {
    return (
      !this.state.isLoadingSubmit &&
      !this.state.isLoadingPreview &&
      this.state.previewedGame &&
      this.state.previewedGame.slug &&
      this.state.previewedGame.slug.length > 0
    );
  };

  _handleToggleHostingType = () => {
    this.setState((state) => {
      let { directoryInputValue, externalUrlInputValue } = this._getDefaultValues();
      let hostingType = state.hostingType === 'castle' ? 'external' : 'castle';
      return {
        ...state,
        hostingType,
        directoryInputValue,
        externalUrlInputValue,
        previewedGame: { slug: null },
        previewError: null,
      };
    });
  };

  _handleSubmitForm = async () => {
    const { externalUrlInputValue, directoryInputValue } = this.state;
    const gameId = this.props.game ? this.props.game.gameId : null;
    const { hostingType } = this.state;
    let addedGame, previewError;
    await this.setState({ isLoadingSubmit: true });
    if (hostingType === 'external' && externalUrlInputValue && externalUrlInputValue.length) {
      try {
        addedGame = await Actions.publishGame(externalUrlInputValue, gameId);
      } catch (e) {
        addedGame = {};
        previewError = e.message;
      }
    } else if (hostingType === 'castle' && directoryInputValue && directoryInputValue.length) {
      try {
        let projectUrl = `file://${directoryInputValue}`;
        let uploadedUrl = await ExecNode.uploadGameAsync(projectUrl);
        addedGame = await Actions.publishGame(uploadedUrl, gameId);
        PublishHistory.addItem(addedGame.gameId, directoryInputValue);
      } catch (e) {
        addedGame = {};
        previewError = e.message;
      }
      // don't block if this fails
      if (gameId) {
        try {
          await ExecNode.writeCastleIdFileAsync(directoryInputValue, gameId);
        } catch (_) {}
      }
    }

    if (previewError) {
      this.setState({ previewError, isLoadingSubmit: false });
    } else {
      await this.setState({ isLoadingSubmit: false });
      if (this.props.onAfterSave) {
        this.props.onAfterSave();
      }
    }
  };

  _handleClickAddHelp = () => {
    NativeUtil.openExternalURL(`${Constants.WEB_HOST}/posts/@castle/adding-game-to-castle-profile`);
  };

  _handleClickHostingHelp = () => {
    NativeUtil.openExternalURL(`${Constants.WEB_HOST}/posts/@castle/hosting-your-own-games`);
  };

  _renderGamePreview = () => {
    let instructions =
      this.state.hostingType === 'castle'
        ? `Choose a folder to preview the game in that folder.`
        : `Enter the url of a .castle file, and we'll check for a game at that url.`;
    return (
      <PublishGamePreview
        existingGameId={this.props.game && this.props.game.gameId}
        game={this.state.previewedGame}
        error={this.state.previewError}
        isLoading={this.state.isLoadingPreview}
        instructions={instructions}
        localGamePath={this.state.directoryInputValue}
      />
    );
  };

  _renderHelp = () => {
    let maybeHostingLink;
    if (this.state.hostingType === 'external') {
      maybeHostingLink = (
        <div className={STYLES_PARAGRAPH}>
          Also, learn about{' '}
          <span className={STYLES_LINK} onClick={this._handleClickHostingHelp}>
            hosting your own games
          </span>
          .
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className={STYLES_HEADING}>Help</div>
        <div className={STYLES_PARAGRAPH}>
          Read our guide on{' '}
          <span className={STYLES_LINK} onClick={this._handleClickAddHelp}>
            adding games to your profile
          </span>
          .
        </div>
        {maybeHostingLink}
      </React.Fragment>
    );
  };

  _renderUploadForm = () => {
    return (
      <UIDirectoryChooser
        value={this.state.directoryInputValue}
        placeholder="Choose a game folder to upload..."
        onChange={this._handleChangeDirectory}
      />
    );
  };

  _renderExternalUrlForm = () => {
    return (
      <UIInputSecondary
        value={this.state.externalUrlInputValue}
        name="externalUrlInputValue"
        label="Online .castle file url"
        onChange={this._handleChangeExternalUrl}
        style={{ marginBottom: 8 }}
      />
    );
  };

  render() {
    let heading, formAction, formElement, secondaryAction;
    if (this.state.hostingType === 'castle') {
      formElement = this._renderUploadForm();
      secondaryAction = 'My game is already hosted online';
    } else {
      formElement = this._renderExternalUrlForm();
      secondaryAction = 'I prefer to upload a game from my computer';
    }
    if (this.props.game) {
      heading = `Update ${this.props.game.title}`;
      formAction = 'Update';
    } else {
      heading = 'Add a Game';
      formAction = this.state.hostingType === 'castle' ? 'Upload and Add Game' : 'Add Game';
    }
    const isSubmitEnabled = this._isFormSubmittable();
    const gamePreviewElement = this._renderGamePreview();
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENT}>
          <div className={STYLES_HEADING}>{heading}</div>
          {formElement}
          {gamePreviewElement}
          <div className={STYLES_FORM_ACTIONS}>
            <UISubmitButton disabled={!isSubmitEnabled} onClick={this._handleSubmitForm}>
              {this.state.isLoadingSubmit ? 'Loading...' : formAction}
            </UISubmitButton>
            <div className={STYLES_SECONDARY_ACTION} onClick={this._handleToggleHostingType}>
              {secondaryAction}
            </div>
          </div>
        </div>
        <div className={STYLES_HELP}>{this._renderHelp()}</div>
      </div>
    );
  }
}
