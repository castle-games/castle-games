import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import Plain from 'slate-plain-serializer';
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
  margin-top: 32px;
  padding: 16px 16px 24px 16px;
  border-bottom: 1px solid ${Constants.colors.border};

  :last-child {
    border-bottom: 0;
  }
`;

export default class CoreProfileEditMedia extends React.Component {
  state = {
    mediaId: null, // if null, create new media
    media: {
      name: '',
      url: '',
      description: Plain.deserialize(''),
    },
  };

  _handleChangeMedia = e => {
    this.setState({ media: { ...this.state.media, [e.target.name]: e.target.value } });
  };

  _handleChangeMediaDescription = ({ value }) => {
    this.setState({ media: { ...this.state.media, description: value } });
  };

  _handleAddMedia = async () => {
    const response = await Actions.addMedia({ ...this.state.media });
    if (!response) {
      return;
    }

    await this.setState({
      mediaId: response.mediaId,
      media: {
        name: response.name,
        url: response.mediaUrl,
        description: Plain.deserialize(''), // TODO: BEN
      },
    });

    if (this.props.onAfterSave) {
      this.props.onAfterSave();
    }
  };

  _isFormSubmittable = () => {
    return (
      this.state.media.name && this.state.media.name.length > 0 &&
      this.state.media.url && this.state.media.url.length > 0
    );
  };

  render() {
    const isSubmitEnabled = this._isFormSubmittable();
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <UIEmptyState
            style={{ padding: `0 0 24px 0`, color: Constants.colors.white }}
            title="Add your media">
            Add something you've created to your profile! When people view your profile they can
            find the games you've made.
          </UIEmptyState>
          <UIInputSecondary
            value={this.state.media.name}
            name="name"
            label="Media name"
            onChange={this._handleChangeMedia}
            style={{ marginBottom: 8 }}
          />
          <UIInputSecondary
            value={this.state.media.url}
            name="url"
            label="Media URL"
            onChange={this._handleChangeMedia}
            style={{ marginBottom: 8 }}
          />
          <UITextArea
            label="Media description"
            value={this.state.media.description}
            onChange={this._handleChangeMediaDescription}
            placeholder="Type a description..."
            style={{ marginBottom: 16, width: 480 }}
          />
          <UISubmitButton
            disabled={!isSubmitEnabled}
            onClick={this._handleAddMedia}>
            Add Media
          </UISubmitButton>
        </div>
      </div>
    );
  }
}
