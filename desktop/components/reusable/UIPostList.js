import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Utilities from '~/common/utilities';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';
import * as NativeUtil from '~/native/nativeutil';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import UIAvatar from '~/components/reusable/UIAvatar';
import UICharacterCard from '~/components/reusable/UICharacterCard';
import UIBoundary from '~/components/reusable/UIBoundary';
import UINavigationLink from '~/components/reusable/UINavigationLink';
import UIPlayTextCTA from '~/components/reusable/UIPlayTextCTA';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

//  box-shadow: inset 0 0 0 1px red;
const STYLES_POST = css`
  display: inline-block;
  padding: 24px 24px 24px 24px;
  position: relative;
`;

const STYLES_GAME_PART = css`
  background: ${Constants.colors.white};
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  position: relative;
`;

const STYLES_GAME_COVER_IMAGE = css`
  width: 188px;
  height: 106px;
  flex-shrink: 0;
  transition: 200ms ease all;
  cursor: pointer;
  background-size: cover;
  background-position: 50% 50%;
  background-color: rgba(0, 0, 0, 0.1);
`;

const STYLES_TITLE = css`
  text-align: right;
  margin-top: 8px;
  font-family: ${Constants.font.game};
  font-size: 18px;
  width: 188px;
  height: 56px;
  cursor: pointer;
`;

const STYLES_AVATAR = css`
  background-size: cover;
  background-position: 50% 50%;
  height: 24px;
  width: 24px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
`;

const STYLES_AVATAR_CREATOR = css`
  font-family: ${Constants.font.system};
  font-weight: 700;
  color: ${Constants.colors.black};
`;

const STYLES_BYLINE = css`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`;

const STYLES_URL = css`
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: ${Constants.font.system};
  overflow-wrap: break-word;
  max-width: 204px;
  width: 100%;
`;

const STYLES_TAG = css`
  position: absolute;
  top: 4px;
  left: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${Constants.colors.text};
  border-radius: 4px;
  padding: 0 8px 0 8px;
  height: 24px;
  font-family: ${Constants.font.monobold};
  color: white;
  font-size: 10px;
`;

const Tag = (props) => {
  return <span className={STYLES_TAG}>{props.children}</span>;
};

class UIPostCell extends React.Component {
  static defaultProps = {
    game: null,
    onGameSelect: () => {},
    onUserSelect: () => {},
    onGameUpdate: null,
    isPreview: false,
    renderCartridgeOnly: false,
  };

  _handleViewSource = (gameEntryPoint) => {
    NativeUtil.openExternalURL(Urls.githubUserContentToRepoUrl(gameEntryPoint));
  };

  _handleGameSelect = () => {
    if (this.props.isPreview) {
      return;
    }
    this.props.onGameSelect(this.props.game);
  };

  _renderCreator = (game) => {
    return (
      <div className={STYLES_BYLINE}>
        <div
          className={STYLES_AVATAR}
          onClick={() => this.props.onUserSelect(game.owner)}
          style={{
            backgroundImage:
              game.owner.photo && game.owner.photo.url ? `url(${game.owner.photo.url})` : null,
          }}
        />
        <div className={STYLES_AVATAR_CREATOR} onClick={() => this.props.onUserSelect(game.owner)}>
          {game.owner.name}
        </div>
      </div>
    );
  };

  render() {
    let { game } = this.props;
    let title = game.title ? game.title : 'Untitled';

    const backgroundColor =
      game.metadata && game.metadata.primaryColor ? `#${game.metadata.primaryColor}` : '#3d3d3d';
    const textColor = Utilities.adjustTextColor(backgroundColor);

    let description;
    let isPrivate = Urls.isPrivateUrl(game.url);

    if (isPrivate || !game.owner || !game.owner.name) {
      description = <div className={STYLES_URL}>{game.url}</div>;
    }

    if (!this.props.renderCartridgeOnly && game.owner) {
      description = this._renderCreator(game);
    }

    return (
      <div className={STYLES_POST}>
        <div className={STYLES_GAME_PART} style={{ color: textColor, backgroundColor }}>
          <div
            className={STYLES_GAME_COVER_IMAGE}
            onClick={this._handleGameSelect}
            style={{ backgroundImage: this.props.coverImageUrl ? `url(${this.props.coverImageUrl})` : null }}
          />
          <div className={STYLES_TITLE} onClick={this._handleGameSelect}>
            {title} {isPrivate ? <Tag>Local</Tag> : null} <br />
          </div>
        </div>
        {description}
      </div>
    );
  }
}

export default class UIPostList extends React.Component {
  render() {
    const { gameItems } = this.props;
    return (
      <div className={STYLES_CONTAINER}>
        {gameItems.map((m) => {
          const key = m.key ? m.key : m.gameId ? m.gameId : m.url;
          return (
            <UIPostCell
              key={key}
              renderCartridgeOnly={this.props.renderCartridgeOnly}
              onGameSelect={this.props.onGameSelect}
              onGameUpdate={this.props.onGameUpdate}
              onUserSelect={this.props.onUserSelect}
              onSignInSelect={this.props.onSignInSelect}
              coverImageUrl={m.coverImage && m.coverImage.url}
              game={m}
              viewer={this.props.viewer}
              isPreview={this.props.isPreview}
            />
          );
        })}
      </div>
    );
  }
}
