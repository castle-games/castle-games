import * as React from 'react';
import * as Constants from '~/common/constants';
import { css } from 'react-emotion';

import UIControl from '~/core-components/reusable/UIControl';
import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIFeaturedPlaylists from '~/core-components/reusable/UIFeaturedPlaylists';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
`;

const STYLES_CONTENT = css`
  padding: 48px 16px 16px 16px;
  max-width: 480px;
  width: 100%;
`;

const STYLES_TITLE = css`
  font-family: ${Constants.font.default};
  color: ${Constants.colors.white};
  font-size: 24px;
  font-weight: 400;
  display: flex;
  align-items: center;
`;

const STYLES_HEADING = css`
  color: ${Constants.colors.white};
  font-size: 18px;
  font-weight: 600;
`;

const STYLES_SUB_PARAGRAPH = css`
  color: ${Constants.colors.white};
  font-size: 14px;
  margin-top: 8px;
  line-height: 1.725;
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.white};
  font-size: 14px;
  margin-top: 16px;
  line-height: 1.725;
`;

const STYLES_ACTIONS = css`
  margin-top: 24px;
  font-size: 18px;
  flex-shrink: 0;
  border-top: 1px solid ${Constants.colors.border};
`;

const STYLES_OPTION = css`
  color: ${Constants.colors.white60};
  border-bottom: 1px solid ${Constants.colors.border};
  font-size: 12px;
  font-weight: 600;
  padding: 16px 0 16px 0;
  transition: 200ms ease color;
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
    color: ${Constants.colors.white};
  }
`;

const STYLES_SECTION = css`
  padding: 32px 16px 16px 16px;
`;

const STYLES_PLAYLISTS = css`
  padding: 16px 0 0 0;
`;

export default class CoreWelcomeScreen extends React.Component {
  static defaultProps = {
    featuredMedia: [],
    featuredPlaylists: [],
  };

  render() {
    const { featuredMedia, featuredPlaylists } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENT}>
          <img height="48px" src="static/castle-wordmark.png" />
          <p className={STYLES_PARAGRAPH}>
            Welcome to Castle. Click a game or a playlist to get started, or use the top search bar
            to find games.
          </p>
        </div>

        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Playlists</div>
          <div className={STYLES_PLAYLISTS}>
            <UIFeaturedPlaylists
              playlists={featuredPlaylists}
              onPlaylistSelect={this.props.onPlaylistSelect}
            />
          </div>
        </div>

        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Staff picks</div>
          <div className={STYLES_SUB_PARAGRAPH}>
            Here are some games we enjoy playing on Castle.
          </div>
        </div>
        <UIListMedia
          mediaItems={featuredMedia}
          onUserSelect={this.props.onUserSelect}
          onMediaSelect={this.props.onMediaSelect}
        />
      </div>
    );
  }
}
