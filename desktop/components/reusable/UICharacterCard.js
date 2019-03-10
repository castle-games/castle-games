import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CARD = css`
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.175);
`;

const STYLES_CARD_CONTENT = css`
  background: black;
`;

const STYLES_CARD_IMAGE = css`
  height: 88px;
  width: 88px;
  background-size: cover;
  background-position: 50% 50%;
  cursor: pointer;
`;

const STYLES_NAME_STRIP = css`
  background: ${Constants.colors.black};
  color: ${Constants.colors.white};
  text-transform: uppercase;
  text-overflow: ellipsis;
  max-width: 88px;
  overflow: hidden;
  font-size: 11px;
  line-height: 11px;
`;

const STYLES_STATS = css`
  display: block;
  color: ${Constants.colors.white};
  font-size: 11px;
  font-family: ${Constants.font.monobold};
`;

const STYLES_STATS_ROW = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 0 2px 0 9px;
`;

const STYLES_STATS_ROW_LEFT = css`
  flex-shrink: 0;
`;

const STYLES_STATS_ROW_RIGHT = css`
  min-width: 25%;
  width: 100%;
  padding-left: 8px;
`;

export default class UICharacterCard extends React.Component {
  render() {
    const { user } = this.props;
    console.log(user);

    return (
      <span className={STYLES_CARD} onClick={this.props.onClick} style={this.props.style}>
        <div className={STYLES_CARD_CONTENT}>
          <div
            className={STYLES_CARD_IMAGE}
            onClick={this.props.onAvatarClick}
            style={{
              backgroundImage: user.photo && user.photo.url ? `url(${user.photo.url})` : null,
            }}
          />
          <div className={STYLES_NAME_STRIP}>@{user.username}</div>
          <div className={STYLES_STATS}>
            <div className={STYLES_STATS_ROW}>
              <span className={STYLES_STATS_ROW_LEFT} style={{ color: 'magenta' }}>
                LVL
              </span>
              <span className={STYLES_STATS_ROW_RIGHT}>1</span>
            </div>
            <div className={STYLES_STATS_ROW}>
              <span className={STYLES_STATS_ROW_LEFT} style={{ color: '#00eded' }}>
                EXP
              </span>
              <span className={STYLES_STATS_ROW_RIGHT}>0</span>
            </div>
          </div>
        </div>
      </span>
    );
  }
}
