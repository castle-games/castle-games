import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import { Value } from 'slate';
import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UIInputSecondary from '~/core-components/reusable/UIInputSecondary';
import UITextArea from '~/core-components/reusable/UITextArea';
import UISubmitButton from '~/core-components/reusable/UISubmitButton';

import ContentEditor from '~/editor/ContentEditor';
import DefaultState from '~/editor/default.json';

const STYLES_CONTAINER = css`
  background ${Constants.colors.background};
  color: ${Constants.colors.white};
  border-top: 16px solid ${Constants.colors.border};
`;

const STYLES_SECTION = css`
  padding: 16px 16px 24px 16px;
  border-bottom: 1px solid ${Constants.colors.border};

  :last-child {
    border-bottom: 0;
  }
`;

const STYLES_FORM_ACTIONS = css`
  display: flex;
  margin-top: 12px;
`;

const STYLES_GAME_PREVIEW = css`
  background: ${Constants.colors.white20};
  padding: 16px;
  cursor: default;
  margin-bottom: 24px;
`;

const STYLES_GAME_PREVIEW_LABEL = css`
  color: ${Constants.colors.white};
  font-size: 10pt;
  margin: 24px 0 8px 0;
`;

const STYLES_GAME_PREVIEW_URL = css`
  text-decoration: underline;
`;

const STYLES_GAME_PREVIEW_TITLE = css`
  margin-bottom: 12px;
  font-size: 14pt;
`;

const STYLES_GAME_PREVIEW_ERROR = css`
  color: ${Constants.colors.red};
  margin: 16px 0 16px 0;
`;

export default class EditGame extends React.Component {
  state = {
    urlInputValue: '',
    previewedGame: {
      slug: null,
    },
    previewError: null,
  };
  _debouncePreviewTimeout = null;

  componentWillReceiveProps(nextProps) {
    this._resetForm();
  }

  _resetForm = () => {
    this.setState({
      urlInputValue: '',
      previewedGame: {
        slug: null,
      },
      previewError: null,
    });
  };

  _updateGamePreview = async () => {
    this._debouncePreviewTimeout = null;
    let previewedGame = {};
    let previewError = null;
    if (this.state.urlInputValue && this.state.urlInputValue.length) {
      try {
        previewedGame = await Actions.previewGameAtUrl(this.state.urlInputValue);
      } catch (e) {
        previewedGame = {};
        previewError = e.message;
      }
    }
    this.setState({ previewedGame, previewError });
  };

  _handleChangeUrl = e => {
    this.setState({ urlInputValue: e.target.value }, () => {
      if (this._debouncePreviewTimeout) {
        clearTimeout(this._debouncePreviewTimeout);
      }
      this._debouncePreviewTimeout = setTimeout(this._updateGamePreview, 300);
    });
  };

  _isFormSubmittable = () => {
    return (
      this.state.previewedGame &&
      this.state.previewedGame.slug &&
      this.state.previewedGame.slug.length > 0
    );
  };
  
  _handleSubmitForm = async () => {
    let addedGame, previewError;
    if (this.state.urlInputValue && this.state.urlInputValue.length) {
      try {
        addedGame = await Actions.registerGameAtUrl(this.state.urlInputValue);
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

  _renderGamePreview = () => {
    if (this.state.previewedGame && this.state.previewedGame.slug) {
      return (
        <div>
          <div className={STYLES_GAME_PREVIEW_LABEL}>Game Preview</div>
          <div className={STYLES_GAME_PREVIEW}>
            <p className={STYLES_GAME_PREVIEW_TITLE}>
              <b>{this.state.previewedGame.name}</b>{' '}
              by {this.state.previewedGame.user.username}
            </p>
            <p>
              Your Castle url will be{' '}
              <span className={STYLES_GAME_PREVIEW_URL}>
                http://playcastle.io/{this.state.previewedGame.slug}
              </span>
            </p>
          </div>
        </div>
      );
    } else if (this.state.previewError) {
      return (
        <div className={STYLES_GAME_PREVIEW_ERROR}>
          {this.state.previewError}
        </div>
      );
    }
    return null;
  };

  render() {
    const isSubmitEnabled = this._isFormSubmittable();
    const formTitle = 'Link a game to your Castle profile';
    const formAction = 'Add';
    const gamePreviewElement = this._renderGamePreview();
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <UIEmptyState
            style={{ padding: `0 0 24px 0`, color: Constants.colors.white }}
            title={formTitle}>
            When you link a game to Castle, it appears on your Castle profile.
          </UIEmptyState>
          <UIInputSecondary
            value={this.state.urlInputValue}
            name="urlInputValue"
            label="URL to a .castle file"
            onChange={this._handleChangeUrl}
            style={{ marginBottom: 8 }}
          />
          {gamePreviewElement}
          <div className={STYLES_FORM_ACTIONS}>
            <UISubmitButton
              disabled={!isSubmitEnabled}
              onClick={this._handleSubmitForm}>
              {formAction}
            </UISubmitButton>
          </div>
        </div>
      </div>
    );
  }
}
