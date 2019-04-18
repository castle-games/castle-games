import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Browser from '~/common/browser';
import * as ExecNode from '~/common/execnode';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';

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

  componentWillReceiveProps(nextProps) {
    this._resetForm();
  }

  _resetForm = () => {
    this.setState({
      hostingType: 'castle',
      directoryInputValue: '',
      externalUrlInputValue: '',
      previewedGame: {
        slug: null,
      },
      previewError: null,
      isLoadingPreview: false,
    });
  };

  _updateGamePreview = async () => {
    const { externalUrlInputValue, directoryInputValue } = this.state;
    this._debouncePreviewTimeout = null;
    let previewedGame = {};
    let previewError = null;
    if (externalUrlInputValue && externalUrlInputValue.length) {
      await this.setState({ isLoadingPreview: true });
      try {
        previewedGame = await Actions.previewGameAtUrl(this.state.externalUrlInputValue);
      } catch (e) {
        previewedGame = {};
        previewError = e.message;
      }
    } else if (directoryInputValue && directoryInputValue.length) {
      try {
        let projectFilename = await ExecNode.getProjectFilenameAtPathAsync(directoryInputValue);
        if (!projectFilename) {
          throw new Error(
            'Unable to find a Castle project in this folder. Make sure to choose a folder that contains a .castle file.'
          );
        }
        previewedGame = await Browser.resolveGameAtUrlAsync(
          `file://${directoryInputValue}/${projectFilename}`
        );
        previewedGame.slug = 'TODO';
        if (!previewedGame.coverImage) {
          if (
            previewedGame.metadata &&
            previewedGame.metadata.coverImage &&
            Urls.isPrivateUrl(previewedGame.metadata.coverImage)
          ) {
            previewedGame.coverImage = {
              url: `file://${directoryInputValue}/${previewedGame.metadata.coverImage}`,
            };
          }
        }
      } catch (e) {
        previewedGame = {};
        previewError = e.message;
      }
    }
    this.setState({ previewedGame, previewError, isLoadingPreview: false });
  };

  _handleChangeExternalUrl = (e) => {
    this.setState({ externalUrlInputValue: e.target.value }, () => {
      if (this._debouncePreviewTimeout) {
        clearTimeout(this._debouncePreviewTimeout);
      }
      this._debouncePreviewTimeout = setTimeout(this._updateGamePreview, 300);
    });
  };

  _handleChangeDirectory = (directoryInputValue) => {
    this.setState({ directoryInputValue }, () => {
      if (this._debouncePreviewTimeout) {
        clearTimeout(this._debouncePreviewTimeout);
      }
      this._updateGamePreview();
    });
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
      let hostingType = state.hostingType === 'castle' ? 'external' : 'castle';
      return { ...state, hostingType, directoryInputValue: '', externalUrlInputValue: '' };
    });
  };

  _handleSubmitForm = async () => {
    const { externalUrlInputValue, directoryInputValue } = this.state;
    let addedGame, previewError;
    if (externalUrlInputValue && externalUrlInputValue.length) {
      try {
        addedGame = await Actions.registerGameAtUrl(this.state.externalUrlInputValue);
      } catch (e) {
        addedGame = {};
        previewError = e.message;
      }
    } else if (directoryInputValue && directoryInputValue.length) {
      try {
        let projectUrl = `file://${directoryInputValue}`;
        let uploadedUrl = await ExecNode.publishProjectAsync(projectUrl);
        addedGame = await Actions.registerGameAtUrl(uploadedUrl);
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
      <React.Fragment>
        <UIDirectoryChooser
          value={this.state.directoryInputValue}
          placeholder="Choose a game folder to upload..."
          onChange={this._handleChangeDirectory}
        />
        <div className={STYLES_PARAGRAPH} />
      </React.Fragment>
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
    const formAction = 'Publish';
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
          <div className={STYLES_HEADING}>Publish a game to your Castle profile</div>
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
