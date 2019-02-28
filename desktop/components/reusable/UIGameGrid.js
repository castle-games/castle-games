import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
`;

const STYLES_GAME_ITEM = css`
  display: inline-block;
  margin-bottom: 16px;
`;

const STYLES_GAME_HOVER_BOX = css`
  overflow: hidden;
  background: ${Constants.colors.blue};
  color: ${Constants.colors.black};
  width: 384px;
  height: 216px;
  flex-shrink: 0;
  transition: 200ms ease all;
  transform: scale(1);
  cursor: pointer;
  margin: 0 24px 8px 0;
  background-size: cover;
  background-position: 50% 50%;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  color: ${Constants.colors.white};
  border: 1px solid ${Constants.colors.border};

  :hover {
    transform: scale(1.025);
  }
`;

const STYLES_GAME_ITEM_BOTTOM = css`
  padding: 8px;
  height: 100%;
  width: 100%;
  background: -webkit-linear-gradient(45deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;

const STYLES_GAME_ITEM_BOTTOM_HEADING = css`
  font-family: ${Constants.font.game};
  font-size: ${Constants.typescale.lvl4};
  line-height: ${Constants.linescale.lvl4};
  font-weight: 400;
`;

const STYLES_GAME_ITEM_BOTTOM_DESCRIPTION = css`
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.linescale.lvl7};
  font-family: ${Constants.font.mono};
  text-transform: uppercase;
`;

const STYLES_GAME_ACTIONS = css`
  font-family: ${Constants.font.mono};
  color: ${Constants.colors.action};
  line-height: ${Constants.linescale.lvl7};
  font-size: ${Constants.typescale.lvl7};
  padding: 6px 0 2px 4px;
  text-transform: uppercase;
  text-decoration: underline;
  cursor: pointer;
`;

class UIGameCell extends React.Component {
  render() {
    let { game } = this.props;
    const title = game.title ? game.title : 'Untitled';
    let description;
    if (Urls.isPrivateUrl(game.url) || !game.owner || !game.owner.name) {
      // if it's a local project, or we don't know about the creator, display the url
      description = game.url;
    } else {
      description = `By ${game.owner.name}`;
    }
    let maybeSyncElement;
    if (this.props.onGameUpdate) {
      maybeSyncElement = (
        <div className={STYLES_GAME_ACTIONS} onClick={() => this.props.onGameUpdate(game)}>
          Sync
        </div>
      );
    }
    return (
      <div className={STYLES_GAME_ITEM}>
        <div
          className={STYLES_GAME_HOVER_BOX}
          onClick={() => this.props.onGameSelect(game)}
          style={{ backgroundImage: this.props.src ? `url(${this.props.src})` : null }}>
          <div className={STYLES_GAME_ITEM_BOTTOM}>
            <div className={STYLES_GAME_ITEM_BOTTOM_HEADING}>{title}</div>
            <div className={STYLES_GAME_ITEM_BOTTOM_DESCRIPTION}>{description}</div>
          </div>
        </div>
        {maybeSyncElement}
      </div>
    );
  }
}

export default class UIGameGrid extends React.Component {
  render() {
    const { gameItems } = this.props;
    return (
      <div className={STYLES_CONTAINER}>
        {gameItems.map((m) => {
          const key = m.key ? m.key : m.gameId ? m.gameId : m.url;
          return (
            <UIGameCell
              key={key}
              onGameSelect={this.props.onGameSelect}
              onGameUpdate={this.props.onGameUpdate}
              src={m.coverImage && m.coverImage.imgixUrl}
              game={m}
            />
          );
        })}
      </div>
    );
  }
}
