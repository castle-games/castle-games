import * as React from 'react';
import * as CEF from '~/common/cef';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';
import shuffle from 'lodash.shuffle';
import { css } from 'react-emotion';

import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';
import UIControl from '~/core-components/reusable/UIControl';
import UIGridMedia from '~/core-components/reusable/UIGridMedia';

const MAX_NUM_FEATURED_MEDIA = 6;

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
`;

const STYLES_FOOTER = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${Constants.colors.border};
`;

const STYLES_FOOTER_CONTENT = css`
  margin: 16px 32px 16px 0;
  cursor: pointer;
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

const STYLES_ACTION = css`
  margin-top: 24px;
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
  padding: 16px 16px 32px 16px;
`;

const STYLES_MEDIA = css`
  padding: 16px 0 0 0;
`;

export default class CoreWelcomeScreen extends React.Component {
  static defaultProps = {
    featuredMedia: [],
  };

  _handleClickTutorial = () => {
    CEF.openExternalURL('https://medium.com/castle-archives/making-games-with-castle-e4d0e9e7a910');
  };

  _handleClickFooter = () => {
    CEF.openExternalURL('http://www.playcastle.io');
  };

  _getFeaturedMedia = () => {
    const { featuredMedia } = this.props;
    let result;
    if (featuredMedia) {
      result = shuffle(featuredMedia);
      if (result.length > MAX_NUM_FEATURED_MEDIA) {
        result = result.slice(0, MAX_NUM_FEATURED_MEDIA);
      }
    }
    return result;
  }

  render() {
    const featuredMedia = this._getFeaturedMedia();
    const externalIcon = (<SVG.Share height="16px" />);

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Play Games</div>
          <div className={STYLES_MEDIA}>
            <UIGridMedia
              mediaItems={featuredMedia}
              onUserSelect={this.props.onUserSelect}
              onMediaSelect={this.props.onMediaSelect}
            />
          </div>
        </div>
        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Make a Game</div>
          <p className={STYLES_PARAGRAPH}>
            Check out our tutorial to get started making your own game or interactive media with Castle.
          </p>
          <div className={STYLES_ACTION}>
            <UIButtonIconHorizontal
              onClick={this._handleClickTutorial}
              icon={externalIcon}>
              Open Tutorial
            </UIButtonIconHorizontal>
          </div>
        </div>
        <div className={STYLES_FOOTER}>
          <div />
          <div className={STYLES_FOOTER_CONTENT} onClick={this._handleClickFooter}>
            <img height="24px" src="static/castle-wordmark.png" />
          </div>
        </div>
      </div>
    );
  }
}
