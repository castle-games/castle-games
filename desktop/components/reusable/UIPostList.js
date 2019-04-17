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
  width: 80%;
  max-width: 600px;
  display: inline-block;
  padding: 24px 24px 24px 24px;
  position: relative;
`;

const STYLES_POST_CARD = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${Constants.colors.white};
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
`;

const STYLES_POST_HEADER = css`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const STYLES_GAME_CONTAINER = css`
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  padding: 0px;
  border-radius: 4px;
`;

const STYLES_GAME_BACKGROUND_LIGTHENER = css`
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  border: 2px solid black;
`;

const STYLES_GAME_COVER_IMAGE = css`
  background-size: cover;
  background-position: 50% 50%;
  height: 16px;
  width: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 6px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
`;

const STYLES_GAME_TITLE = css`
  font-family: ${Constants.font.game};
  font-size: 13px;
`;

const STYLES_USER_CONTAINER = css`
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
`;

const STYLES_USER_PHOTO = css`
  background-size: cover;
  background-position: 50% 50%;
  height: 32px;
  width: 32px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
`;

const STYLES_USER_NAME = css`
  font-family: ${Constants.font.system};
  font-weight: 700;
`;

const STYLES_POST_BODY = css`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 4px;
  background: ${Constants.colors.white};
  border-radius: 4px;
`;

const STYLES_POST_MESSAGE = css`
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.lvl6};
  line-height: ${Constants.linescale.lvl6};
  margin-bottom: 16px;
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
    isPreview: false,
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

  render() {
    let { game } = this.props;
    let title = game.title ? game.title : 'Untitled';

    const backgroundColor =
      game.metadata && game.metadata.primaryColor ? `#${game.metadata.primaryColor}` : '#3d3d3d';
    const textColor = Utilities.adjustTextColor(backgroundColor);

    const user = game.owner;

    return (
      <div className={STYLES_POST}>
        <div className={STYLES_POST_CARD}>
          <div className={STYLES_POST_HEADER}>
            <div className={STYLES_USER_CONTAINER}>
              <div
                className={STYLES_USER_PHOTO}
                onClick={() => this.props.onUserSelect(user)}
                style={{
                  backgroundImage: user.photo && user.photo.url ? `url(${user.photo.url})` : null,
                }}
              />
              <div className={STYLES_USER_NAME} onClick={() => this.props.onUserSelect(user)}>
                {user.name}
              </div>
            </div>
            <div className={STYLES_GAME_CONTAINER} style={{ backgroundColor }}>
              <div className={STYLES_GAME_BACKGROUND_LIGTHENER} style={{ borderColor: backgroundColor }}>
                <div
                  className={STYLES_GAME_COVER_IMAGE}
                  onClick={this._handleGameSelect}
                  style={{
                    backgroundImage: this.props.coverImageUrl
                      ? `url(${this.props.coverImageUrl})`
                      : null,
                  }}
                />
                <div className={STYLES_GAME_TITLE} onClick={this._handleGameSelect}>
                  {title}
                </div>
              </div>
            </div>
          </div>
          <div className={STYLES_POST_BODY}>
            <div className={STYLES_POST_MESSAGE}>hello, world</div>
          </div>
        </div>
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
              onGameSelect={this.props.onGameSelect}
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
