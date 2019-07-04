import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Urls from '~/common/urls';
import * as Utilities from '~/common/utilities';
import * as Strings from '~/common/strings';
import * as NativeUtil from '~/native/nativeutil';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

// NOTE(jim): This needs to be revised so that we're not animating padding
// but we're doing a transform for performance to make use of the compositor.
const STYLES_CONTAINER = css`
  display: inline-block;
  position: relative;
  cursor: pointer;
  background: transparent;
  margin: 0 16px 16px 0;
  border-radius: ${Constants.card.radius};
  transition: 195ms ease all;

  figure {
    border-radius: ${Constants.card.radius};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    transition: 80 ease all;
  }

  section {
    transition: 195ms ease all;
    padding: 12px 0px 8px 0px;
  }

  :hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);

    section {
      padding: 12px 0px 8px 8px;
    }

    figure {
      border-radius: ${Constants.card.radius} ${Constants.card.radius} 0px 0px;
      box-shadow: none;
    }
  }
`;

const STYLES_TOP_SECTION = css`
  width: ${Constants.card.width};
  height: ${Constants.card.imageHeight};
`;

const STYLES_GAME_SCREENSHOT = css`
  width: ${Constants.card.width};
  height: ${Constants.card.imageHeight};
  cursor: pointer;
  background-size: cover;
  background-position: 50% 50%;
  background-color: rgba(0, 0, 0, 0.1);
`;

const STYLES_PLAY_ICON = css`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${Constants.card.iconColor};
`;

const STYLES_PLAY_HOVER = css`
  @keyframes button-color-change {
    0% {
      color: ${Constants.colors.brand4};
    }
    50% {
      color: ${Constants.colors.brand1};
    }
    100% {
      color: ${Constants.colors.brand2};
    }
  }

  cursor: pointer;
  animation: button-color-change infinite 400ms;
  color: white;
`;

const STYLES_DESCRIPTION_SECTION = css`
  padding: 12px 16px 8px 16px;
  font-family: ${Constants.font.system};
`;

const STYLES_GAME_DESCRIPTION_HEADER = css`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  font-weight: 600;
`;

const STYLES_GAME_DESCRIPTION = css`
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
`;

const STYLES_DETAIL_SECTION = css`
  display: flex;
  flex-direction: row;
  padding: 12px 0px 8px 8px;
`;

const STYLES_TITLE_AND_PLAY = css`
  display: flex;
  flex-direction: row;
  line-height: 0.8;
  margin-bottom: 4px;
`;

const STYLES_GAME_TITLE_AND_AUTHOR = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 25%;
`;

const STYLES_GAME_TITLE = css`
  display: inline-flex;
  font-family: ${Constants.font.system};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  :hover {
    color: #55555f;
  }
`;

const STYLES_AVATAR = css`
  background-size: cover;
  background-position: 50% 50%;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  margin-right: 8px;
`;

const STYLES_BYLINE = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`;

const STYLES_AUTHOR_AND_PLAY_COUNT = css`
  display: flex;
  flex-direction: row;
  margin-top: 2px;
  font-family: ${Constants.font.system};
  font-size: 13px;
  color: #8d8d8d;
  font-weight: 500;
`;

const STYLES_GAME_AUTHOR = css`
  display: inline-flex;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const STYLES_PLAY_COUNT = css`
  margin-left: 5px;
`;

export default class UIGameHeader extends React.Component {
  static defaultProps = {
    game: null,
    onGameSelect: () => {},
    onUserSelect: () => {},
  };

  _handleGameSelect = () => {
    this.props.onGameSelect(this.props.game);
  };

  render() {
    let { game } = this.props;
    let title = game.title ? game.title : 'Untitled';

    const backgroundColor =
      game.metadata && game.metadata.primaryColor ? `#${game.metadata.primaryColor}` : '#F4F4F5';
    const textColor = Utilities.adjustTextColorWithEmphasis(backgroundColor, false);

    const finalColor = backgroundColor;

    let descriptionText = game.description
      ? Strings.elide(game.description, 180)
      : 'No description yet :)';
    let username, playCount;

    let isPrivate = Urls.isPrivateUrl(game.url);
    let isLocalFile = isPrivate || !game.owner || !game.owner.name;
    if (isLocalFile) {
      descriptionText = game.url;
      username = 'Local Project'; // TODO(Jason): show date last edited?
    } else {
      username = game.owner.username;
      playCount = (
        <span className={STYLES_PLAY_COUNT}>
          {'\u2022 '}
          {game.playCount} plays
        </span>
      );
    }

    return (
      <div className={STYLES_CONTAINER} onClick={this._handleGameSelect}>
        <div className={STYLES_TOP_SECTION}>
          <figure
            className={STYLES_GAME_SCREENSHOT}
            style={{
              backgroundImage: game.coverImage ? `url(${game.coverImage.url})` : null,
            }}
          />
        </div>

        <section className={STYLES_DETAIL_SECTION}>
          <div className={STYLES_PLAY_ICON}>
            <SVG.Play style={{ width: 16, height: 16 }} />
          </div>
        </section>
      </div>
    );
  }
}
