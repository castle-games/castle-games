import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import GLLoaderScreen from '~/isometric/components/GLLoaderScreen';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  background: #000000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_CONTAINER_THEATER = css`
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_LOADING_OVERLAY_CONTAINER = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px;
`;

const STYLES_LOADING_OVERLAY_ELEMENT = css`
  font-family: ${Constants.font.mono};
  color: ${Constants.logs.system};
  font-size: 10px;
`;

export default class GameScreenMedia extends React.Component {
  render() {
    const { luaNetworkRequests, loadingPhase, loaded, theater, onSetGameRef } = this.props;

    let maybeLoadingAnimation, maybeLoadingOverlay;
    if (!loaded) {
      maybeLoadingAnimation = <GLLoaderScreen />;

      maybeLoadingOverlay = (
        <div className={STYLES_LOADING_OVERLAY_CONTAINER}>
          {luaNetworkRequests.length > 0 ? (
            luaNetworkRequests.map(({ url }) => (
              <div className={STYLES_LOADING_OVERLAY_ELEMENT}>Fetching {url}...</div>
            ))
          ) : loadingPhase === 'initializing' ? (
            <div className={STYLES_LOADING_OVERLAY_ELEMENT}>Initializing system...</div>
          ) : (
            <div className={STYLES_LOADING_OVERLAY_ELEMENT}>Starting game...</div>
          )}
        </div>
      );
    }

    let className = STYLES_CONTAINER;
    if (theater) {
      className = STYLES_CONTAINER_THEATER;
    }

    return (
      <div ref={onSetGameRef} className={className}>
        {maybeLoadingAnimation}
        {maybeLoadingOverlay}
      </div>
    );
  }
}
