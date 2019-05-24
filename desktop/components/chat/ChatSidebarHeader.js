import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  padding: 16px 16px 16px 16px;
  margin-bottom: 8px;
  min-height: 64px;
  width: 100%;
  flex-shrink: 0;
  color: ${Constants.colors.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
`;

const STYLES_HEADING = css`
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: flex-start;
  cursor: pointer;

  :hover {
    color: magenta;
  }
`;

const STYLES_AUTH = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const STYLES_AVATAR = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 20px;
  width: 20px;
  margin-top: 8px;
  background-color: magenta;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
`;

const STYLES_BYLINE = css`
  min-width: 10%;
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  margin-top: 10px;

  strong {
    cursor: pointer;
    transition: 200ms ease color;

    :hover {
      color: magenta;
    }
  }
`;

export default class ChatSidebarHeader extends React.Component {
  render() {
    const { navigator, viewer } = this.props;

    if (!viewer) {
      return (
        <header className={STYLES_HEADER}>
          <h2 className={STYLES_HEADING}>[bind server name]</h2>
          <div className={STYLES_AUTH}>
            <span className={STYLES_BYLINE}>
              <strong style={{ cursor: 'pointer' }}>Sign in</strong>
            </span>
          </div>
        </header>
      );
    }

    let url;
    if (viewer && viewer.photo) {
      url = this.props.viewer.photo.url;
    }

    return (
      <header className={STYLES_HEADER}>
        <h2 className={STYLES_HEADING} onClick={this.props.onShowOptions}>
          [bind server name] <SVG.Menu size="14px" style={{ margin: '3px 0 0 6px' }} />
        </h2>
        <div className={STYLES_AUTH}>
          <span className={STYLES_AVATAR} style={{ backgroundImage: `url('${url}')` }} />
          <span className={STYLES_BYLINE} onClick={() => navigator.navigateToUserProfile(viewer)}>
            Signed in as <strong style={{ cursor: 'pointer' }}>{viewer.username}</strong>
          </span>
        </div>
      </header>
    );
  }
}
