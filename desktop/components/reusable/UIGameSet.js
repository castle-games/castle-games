import * as React from 'react';
import * as Constants from '~/common/constants';

import UIGameCell from '~/components/reusable/UIGameCell';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
  margin-left: 24px;
`;

const STYLES_CELL_ITEM = css`
  margin: 0 16px 16px 0;
`;

const UIGameSet = (props) => {
  const _container = React.useRef(null);

  const {
    numRowsToElide = -1,
    gameItems,
    onGameSelect,
    onGameSessionSelect,
    onGameUpdate,
    onUserSelect,
  } = props;

  const _numGamesToRender = () => {
    if (numRowsToElide > 0) {
      let numGamesPerRow = 0;
      if (_container.current) {
        numGamesPerRow = Math.floor(
          _container.current.offsetWidth / (parseInt(Constants.card.width, 10) + 16)
        );
      }
      return Math.max(1, numGamesPerRow * numRowsToElide);
    }
    return gameItems && gameItems.length;
  };

  if (!gameItems) return null;

  let itemsToRender = gameItems;
  if (numRowsToElide > 0) {
    itemsToRender = gameItems.slice(0, _numGamesToRender());
  }
  return (
    <div className={STYLES_CONTAINER} ref={_container}>
      {itemsToRender.map((m, i) => {
        const key = m.key ? m.key : m.gameId ? m.gameId : m.url;
        return (
          <div className={STYLES_CELL_ITEM} key={`${key}-${i}`}>
            <UIGameCell
              onGameSelect={onGameSelect}
              onGameSessionSelect={onGameSessionSelect}
              onGameUpdate={onGameUpdate}
              onUserSelect={onUserSelect}
              src={m.coverImage && m.coverImage.url}
              game={m}
            />
          </div>
        );
      })}
    </div>
  );
}

export default UIGameSet;
