import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import { Value } from 'slate';
import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UIButtonSecondary from '~/core-components/reusable/UIButtonSecondary';
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

export default class CoreProfileEditMedia extends React.Component {
  state = {
    media: {
      mediaId: null,
      name: '',
      mediaUrl: '',
    },
  };

  componentDidMount() {
    this._resetForm(this.props.media);
  }

  componentWillReceiveProps(nextProps) {
    const existingMediaId = (this.props.media && this.props.media.mediaId) ?
          this.props.media.mediaId :
          null;
    const nextMediaId = (nextProps.media && nextProps.media.mediaId) ?
          nextProps.media.mediaId :
          null
    if (existingMediaId == null || nextMediaId != existingMediaId ||
        (
          nextMediaId == existingMediaId &&
          nextProps.media.updatedTime !== this.props.media.updatedTime
        )
       ) {
      // we're rendering a new user, reset state.
      this._resetForm(nextProps.media);
    }
  }

  _resetForm = (media) => {
    this.setState({
      media: {
        ...media,
      },
    });
  };

  _handleChangeMedia = e => {
    this.setState({ media: { ...this.state.media, [e.target.name]: e.target.value } });
  };

  _isFormSubmittable = () => {
    return (
      this.state.media &&
      this.state.media.name && this.state.media.name.length > 0 &&
      this.state.media.mediaUrl && this.state.media.mediaUrl.length > 0
    );
  };

  _removeMediaAsync = async () => {
    const mediaId = (this.props.media) ? this.props.media.mediaId : null;
    if (mediaId) {
      const response = await Actions.removeMedia({ mediaId });
      if (!response) {
        return;
      }

      if (this.props.onAfterSave) {
        this.props.onAfterSave();
      }
    }
  };
  
  _handleSubmitForm = async () => {
    let response;
    if (this.state.media.mediaId) {
      response = await Actions.updateMediaAsync({
        mediaId: this.state.media.mediaId,
        media: { ...this.state.media },
      });
      if (!response) {
        return;
      }
    } else {
      response = await Actions.addMedia({ media: { ...this.state.media } });
      if (!response) {
        return;
      }
    }

    await this.setState({
      media: {
        ...response,
      },
    });

    if (this.props.onAfterSave) {
      this.props.onAfterSave();
    }
  };

  render() {
    const isSubmitEnabled = this._isFormSubmittable();
    const isEditing = !!(this.props.media && this.props.media.mediaId);
    const gameTitle = (isEditing && this.props.media && this.props.media.name) ? this.props.media.name : 'an untitled game';
    const formTitle = (isEditing) ? `Editing ${gameTitle}` : 'Register a game with Castle';
    const formAction = (isEditing) ? 'Save Changes' : 'Register';

    let maybeDeleteButton;
    if (isEditing) {
      maybeDeleteButton = (
        <div style={{ marginLeft: 32 }}>
          <UIButtonSecondary
            onClick={this._removeMediaAsync}>
            Delete
          </UIButtonSecondary>
        </div>
      );
    }
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <UIEmptyState
            style={{ padding: `0 0 24px 0`, color: Constants.colors.white }}
            title={formTitle}>
            When a game is registered, it appears on your Castle profile.
          </UIEmptyState>
          <UIInputSecondary
            value={this.state.media.name}
            name="name"
            label="Game Title"
            onChange={this._handleChangeMedia}
            style={{ marginBottom: 8 }}
          />
          <UIInputSecondary
            value={this.state.media.mediaUrl}
            name="mediaUrl"
            label="Game URL"
            onChange={this._handleChangeMedia}
            style={{ marginBottom: 8 }}
          />
          <div className={STYLES_FORM_ACTIONS}>
            <UISubmitButton
              disabled={!isSubmitEnabled}
              onClick={this._handleSubmitForm}>
              {formAction}
            </UISubmitButton>
            {maybeDeleteButton}
          </div>
        </div>
      </div>
    );
  }
}
