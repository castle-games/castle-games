import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UILoadingCard from '~/components/reusable/UILoadingCard';

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
  margin: 48px 24px;
`;

const STYLES_CONTENT_MESSAGE = css`
  height: 100%;
  display: flex;
  align-items: center;
`;

const STYLES_MESSAGE = css`
  margin: 48px;
  max-width: 512px;

  p {
    margin: 12px 0;
    font-size: 16px;
    line-height: 20px;
  }

  h2 {
    font-weight: 600;
    font-size: 20px;
    margin: 12px 0;
  }
`;

export default class AppLoadingScreen extends React.Component {
  state = {
    cards: null,
    timeout: false,
  };

  async componentDidMount() {
    this._mounted = true;
    await Actions.delay(1000);
    this._mounted && this.setState({ cards: Array.from({ length: 12 }) });
    this._waitForTimeout();
  }

  _waitForTimeout = async () => {
    await Actions.delay(20 * 1000);
    this._mounted && this.setState({ timeout: true });
  };

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const { cards, timeout } = this.state;
    let content;
    if (timeout) {
      content = (
        <div className={STYLES_CONTENT_MESSAGE}>
          <div className={STYLES_MESSAGE}>
            <h2>Castle is taking a long time to load.</h2>
            <p>
              We're trying to load Castle, but it seems like it's taking longer than expected. If
              the problem continues, double check your internet connection, or maybe try launching
              Castle again.
            </p>
          </div>
        </div>
      );
    } else if (cards) {
      content = (
        <div className={STYLES_CONTENT_CARDS}>
          {cards.map((card, ii) => (
            <UILoadingCard key={ii} />
          ))}
        </div>
      );
    }

    return (
      <div id="loader-inner" className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENT}>
          <div className={STYLES_TOP_BAR} />
          <div className={STYLES_SCREEN}>{content}</div>
        </div>
        <div className={STYLES_SIDEBAR} />
      </div>
    );
  }
}
