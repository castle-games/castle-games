import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
`;

const STYLES_MEDIA_ITEM = css`
  border-radius: 8px;
  overflow: hidden;
  background: ${Constants.colors.yellow};
  color: ${Constants.colors.black};
  display: inline-block;
  width: 184px;
  height: 256px;
  flex-shrink: 0;
  transition: 200ms ease all;
  transform: scale(1);
  cursor: pointer;
  margin: 0 24px 24px 0;
  background-size: cover;
  background-position: 50% 50%;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  color: ${Constants.colors.white};
  border: 2px solid ${Constants.colors.yellow};

  :hover {
    transform: scale(1.025);
  }
`;

const STYLES_MEDIA_ITEM_BOTTOM = css`
  padding: 8px;
  height: 100%;
  width: 100%;
  background: -webkit-linear-gradient(45deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;

const STYLES_MEDIA_ITEM_BOTTOM_HEADING = css`
  font-size: 14px;
  line-height: 24px;
  font-weight: 600;
`;

const STYLES_MEDIA_ITEM_BOTTOM_DESCRIPTION = css`
  font-size: 10px;
  line-height: 1.725;
`;

class UIMediaCell extends React.Component {
  render() {
    const name = (this.props.media.name) ? this.props.media.name : '';
    return (
      <div
        className={STYLES_MEDIA_ITEM}
        onClick={() => this.props.onMediaSelect(this.props.media)}
        style={{ backgroundImage: this.props.src ? `url(${this.props.src})` : null }}>
        <div className={STYLES_MEDIA_ITEM_BOTTOM}>
          <div className={STYLES_MEDIA_ITEM_BOTTOM_HEADING}>{name}</div>
          <div className={STYLES_MEDIA_ITEM_BOTTOM_DESCRIPTION}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default class UIGridMedia extends React.Component {
  render() {
    const { mediaItems } = this.props;
    return (
      <div className={STYLES_CONTAINER}>
        {mediaItems.map(m => {
          const key = (m.mediaId) ? m.mediaId : m.mediaUrl;
          return (
            <UIMediaCell
              key={key}
              onMediaSelect={this.props.onMediaSelect}
              src={m.coverImage && m.coverImage.imgixUrl}
              media={m}
            />
          );
        })}
      </div>
    );
  }
}
