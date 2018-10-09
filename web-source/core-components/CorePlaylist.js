import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import ContentEditor from '~/editor/ContentEditor';

const STYLES_CONTAINER = css`
  @keyframes playlist-scene-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: playlist-scene-animation 280ms ease;

  width: 100%;
  min-width: 25%;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_PLAYLIST_CARD = css`
  padding: 16px;
  background ${Constants.brand.background};
  color: ${Constants.colors.black};
`;

const STYLES_PARAGRAPH = css`
  font-size: 16px;
  font-weight: 300;
  line-height: 1.5;
`;

const STYLES_HEADING = css`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
`;

export default class CorePlaylist extends React.Component {
  render() {
    let rich =
      this.props.playlist &&
      this.props.playlist.description &&
      this.props.playlist.description.rich;
    if (rich) {
      rich = Strings.loadEditor(rich);
    }

    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss onDismiss={this.props.onDismiss} />
        <div className={STYLES_PLAYLIST_CARD}>
          <h1 className={STYLES_HEADING}>{this.props.playlist.name}</h1>
          {rich ? (
            <ContentEditor readOnly value={rich} />
          ) : (
            <p className={STYLES_PARAGRAPH}>There is no description for this playlist.</p>
          )}
        </div>
      </div>
    );
  }
}
