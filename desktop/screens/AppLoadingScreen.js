import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
`;

const STYLES_CONTENT = css`
  width: 100%;
  height: 100%;
`;

const STYLES_TOP_BAR = css`
  background: #f3f3f3;
  flex-shrink: 0;
  width: 100%;
  height: 48px;
`;

const STYLES_SCREEN = css`
  margin-top: 54px;
  margin-right: ${Constants.sidebar.width};
`;

const STYLES_SIDEBAR = css``;

const STYLES_CONTENT_CARDS = css`
  display: flex;
  flex-wrap: wrap;
  margin: 24px;
`;

const STYLES_CARD = css`
  width: ${Constants.card.width};
  height: 124px;
  background: #f3f3f3;
  border-radius: ${Constants.card.radius};
  margin: 0 16px 64px 0;
`;

export default class AppLoadingScreen extends React.Component {
  render() {
    let cards = [];
    for (let ii = 0; ii < 21; ii++) {
      cards.push({});
    }
    return (
      <div id="loader-inner" className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENT}>
          <div className={STYLES_TOP_BAR} />
          <div className={STYLES_SCREEN}>
            <div className={STYLES_CONTENT_CARDS}>
              {cards.map((card) => (
                <div className={STYLES_CARD} />
              ))}
            </div>
          </div>
        </div>
        <div className={STYLES_SIDEBAR} />
      </div>
    );
  }
}
