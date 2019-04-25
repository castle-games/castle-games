import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as PublishMockActions from '~/common/publish-mock-actions';

import { css } from 'react-emotion';

import UIDirectoryChooser from '~/components/reusable/UIDirectoryChooser';
import UIGameGrid from '~/components/reusable/UIGameGrid';
import UIInputSecondary from '~/components/reusable/UIInputSecondary';
import UISubmitButton from '~/components/reusable/UISubmitButton';

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
`;

const STYLES_SECTION = css`
  padding: 24px 24px 24px 24px;
  width: 50%;
  min-width: 300px;
  max-width: 50%;
`;

const STYLES_FORM_ACTIONS = css`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const STYLES_HEADING = css`
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl5};
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
  margin-bottom: 16px;
`;

const STYLES_GAME_PREVIEW_ERROR = css`
  color: ${Constants.colors.red};
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

const STYLES_LINK = css`
  color: ${Constants.colors.action};
  text-decoration: underline;
  cursor: pointer;
`;

export default class RegisterGame extends React.Component {
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
  };
  _debouncePreviewTimeout = null;

  componentDidUpdate(prevProps) {
    if (this.props.game !== prevProps.game) {
      this._resetForm();
    }
  }

  _getDefaultValues = () => {
    const { game } = this.props;
    return {
      directoryInputValue: game ? '' : '', // TODO: look up from history
      externalUrlInputValue: game ? '' : '', // TODO: need this data from the api
    };
  };

  _resetForm = () => {
    let defaults = this._getDefaultValues();
    this.setState({
      hostingType: 'castle',
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

  _updateGamePreview = async () => {
    if (this._debouncePreviewTimeout) {
      clearTimeout(this._debouncePreviewTimeout);
    }
    this._debouncePreviewTimeout = null;

    const { externalUrlInputValue, directoryInputValue } = this.state;
    const gameId = this.props.game ? this.props.game.gameId : null;
    let previewedGame = {};
    let previewError = null;
    if (externalUrlInputValue && externalUrlInputValue.length) {
      await this.setState({ isLoadingPreview: true });
      try {
        previewedGame = await PublishMockActions.previewGameAtUrl(externalUrlInputValue, gameId);
      } catch (e) {
        previewedGame = {};
        previewError = e.message;
      }
    } else if (directoryInputValue && directoryInputValue.length) {
      await this.setState({ isLoadingPreview: true });
      try {
        previewedGame = await PublishMockActions.previewLocalGame(directoryInputValue, gameId);
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
      this.state.previewedGame &&
      this.state.previewedGame.slug &&
      this.state.previewedGame.slug.length > 0
    );
  };

  _handleToggleHostingType = () => {
    this.setState((state) => {
      let { directoryInputValue, externalUrlInputValue } = this._getDefaultValues();
      let hostingType = state.hostingType === 'castle' ? 'external' : 'castle';
      return { ...state, hostingType, directoryInputValue, externalUrlInputValue };
    });
  };

  _handleSubmitForm = async () => {
    const { externalUrlInputValue, directoryInputValue } = this.state;
    const gameId = this.props.game ? this.props.game.gameId : null;
    let addedGame, previewError;
    if (externalUrlInputValue && externalUrlInputValue.length) {
      try {
        addedGame = await PublishMockActions.publishGame(externalUrlInputValue, gameId);
      } catch (e) {
        addedGame = {};
        previewError = e.message;
      }
    } else if (directoryInputValue && directoryInputValue.length) {
      try {
        let uploadedUrl = await PublishMockActions.uploadGame(directoryInputValue);
        addedGame = await PublishMockActions.publishGame(uploadedUrl, gameId);
      } catch (e) {
        addedGame = {};
        previewError = e.message;
      }
    }

    if (previewError) {
      this.setState({ previewError });
    } else {
      if (this.props.onAfterSave) {
        this.props.onAfterSave();
      }
    }
  };

  _handleClickHelp = () => {
    NativeUtil.openExternalURL(`${Constants.WEB_HOST}/posts/@castle/adding-game-to-castle-profile`);
  };

  _renderGamePreview = () => {
    if (this.state.previewedGame && this.state.previewedGame.slug) {
      return (
        <div>
          <div className={STYLES_HEADING}>Game Preview</div>
          <UIGameGrid gameItems={[this.state.previewedGame]} isPreview={true} />
          <div className={STYLES_PARAGRAPH}>
            Your Castle url will be{' '}
            <span className={STYLES_GAME_PREVIEW_URL}>
              {Constants.WEB_HOST}/{this.state.previewedGame.slug}
            </span>
          </div>
        </div>
      );
    } else if (this.state.previewError) {
      return (
        <div>
          <div className={STYLES_HEADING}>Game Preview Failed</div>
          <div className={STYLES_GAME_PREVIEW_ERROR}>
            There was a problem previewing the game at that url.
          </div>
          <div className={STYLES_GAME_PREVIEW_ERROR_DETAIL}>{this.state.previewError}</div>
        </div>
      );
    } else if (this.state.isLoadingPreview) {
      return <div className={STYLES_HEADING}>Loading Game Preview...</div>;
    } else {
      return (
        <div>
          <div className={STYLES_HEADING}>Need Help?</div>
          <div className={STYLES_PARAGRAPH}>
            <span className={STYLES_LINK} onClick={this._handleClickHelp}>
              Read our guide
            </span>{' '}
            on adding games to your profile.
          </div>
        </div>
      );
    }
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
      <React.Fragment>
        <UIInputSecondary
          value={this.state.externalUrlInputValue}
          name="externalUrlInputValue"
          label="URL to a .castle file"
          onChange={this._handleChangeExternalUrl}
          style={{ marginBottom: 8 }}
        />
        <div className={STYLES_PARAGRAPH}>
          Enter the url of a .castle file, and we'll check for a game at that url.
        </div>
      </React.Fragment>
    );
  };

  render() {
    const isSubmitEnabled = this._isFormSubmittable();
    const heading = this.props.game
      ? `Publish an update to ${this.props.game.title}`
      : 'Publish a game to your Castle profile';
    const formAction = this.props.game ? 'Update' : 'Publish';
    const gamePreviewElement = this._renderGamePreview();
    let formElement, secondaryAction;
    if (this.state.hostingType === 'castle') {
      formElement = this._renderUploadForm();
      secondaryAction = 'My game is already hosted somewhere else';
    } else {
      formElement = this._renderExternalUrlForm();
      secondaryAction = 'I prefer to upload a game from my computer';
    }
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>{heading}</div>
          {formElement}
          <div className={STYLES_FORM_ACTIONS}>
            <UISubmitButton disabled={!isSubmitEnabled} onClick={this._handleSubmitForm}>
              {formAction}
            </UISubmitButton>
            <div className={STYLES_SECONDARY_ACTION} onClick={this._handleToggleHostingType}>
              {secondaryAction}
            </div>
          </div>
        </div>
        <div className={STYLES_SECTION}>{gamePreviewElement}</div>
      </div>
    );
  }
}
