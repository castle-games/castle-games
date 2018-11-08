import * as React from 'react';
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
`;

const STYLES_SECTION = css`
  margin-top: 32px;
  padding: 16px 16px 24px 16px;
  border-bottom: 1px solid ${Constants.colors.border};

  :last-child {
    border-bottom: 0;
  }
`;

export default class CoreProfileAddPlaylist extends React.Component {
  state = {
    playlist: {
      name: '',
      description: Plain.deserialize(''),
    },
  };

  _handleChangePlaylist = e => {
    this.setState({ playlist: { ...this.state.playlist, [e.target.name]: e.target.value } });
  };

  _handleChangePlaylistDescription = ({ value }) => {
    this.setState({ playlist: { ...this.state.playlist, description: value } });
  };

  _handleAddPlaylist = async () => {
    await this.props.onPlaylistAdd({ ...this.state.playlist });

    this.setState({
      playlist: {
        name: '',
        description: Plain.deserialize(''),
      },
    });
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <UIEmptyState
            style={{ padding: `0 0 24px 0`, color: Constants.colors.white }}
            title="Create a new playlist">
            Playlists are lists of media you can share with other people to play.
          </UIEmptyState>
          <UIInputSecondary
            value={this.state.playlist.name}
            name="name"
            label="Playlist name"
            onChange={this._handleChangePlaylist}
            style={{ marginBottom: 8 }}
          />
          <UITextArea
            label="Playist description"
            value={this.state.playlist.description}
            onChange={this._handleChangePlaylistDescription}
            placeholder="Type a description..."
            style={{ marginBottom: 16 }}
          />
          <UISubmitButton onClick={this._handleAddPlaylist}>Add Playlist</UISubmitButton>
        </div>
      </div>
    );
  }
}
