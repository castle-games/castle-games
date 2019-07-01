import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';

import UIGameCell from '~/components/reusable/UIGameCell';
import { UIPostCell } from '~/components/reusable/UIPostList';

const STYLES_OUTER = css`
  flex-shrink: 0;
  width: 100%;
  max-width: 420px;
  height: 236px;
  margin-bottom: 8px;
  display: block;
  cursor: pointer;
  text-decoration: none;
`;

const STYLES_CONTAINER = css`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  border-radius: 4px 4px 4px 4px;
  background-color: magenta;
  background-size: cover;
  background-position: 50% 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  transition: 200ms ease all;
  transition-property: transform;
  color: white;

  :hover {
    transform: scale(1.025);
  }
`;

const STYLES_POST_CELL_CONTAINER = css`
  padding: 16px;
  display: inline-block;
  border: 1px solid #ececec;
  max-width: 532px;
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
  width: 100%;
  background: #ffffff;
`;

const STYLES_SECTION = css`
  font-family: 'game-heading';
  font-size: 18px;
  height: 100%;
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 0px 0px 4px 4px;
  line-height: 1.5;
  background: linear-gradient(transparent, ${Constants.REFACTOR_COLORS.text});
`;

const STYLES_POST = css`
  cursor: pointer;
  color: ${Constants.colors.white};
  text-decoration: none;
  overflow-wrap: break-word;
  width: 100%;

  :hover {
    color: magenta;
  }
`;

let gameCache = {};
let postCache = {};

export default class ChatPost extends React.Component {
  static defaultProps = {
    theme: {
      embedBorder: `1px solid #ececec`,
      embedBackground: `#ffffff`,
      embedBoxShadow: `0 1px 4px rgba(0, 0, 0, 0.07)`,
    },
  };

  state = {};

  _handleNavigateToUser = async (user) => {
    this.props.navigator.navigateToUserProfile(user);
  };

  _handleNavigateToGame = () => {
    const { post, game } = this.state;

    if (game) {
      return this.props.navigator.navigateToGame(game);
    }

    this.props.navigator.navigateToGame(post.sourceGame, { post });
  };

  async componentDidMount() {
    let url = this.props.message.text;
    url = url.replace('castle://', 'http://');

    if (!this.props.urlData.postId) {
      let game = gameCache[url];
      if (!game) {
        game = await Actions.getGameByURL(url);
        gameCache[url] = game;
      }

      if (game) {
        this.setState({ game });
        return;
      }
    }

    let post = postCache[this.props.urlData.postId];
    if (!post) {
      post = await Actions.getPostById(this.props.urlData.postId);
      postCache[this.props.urlData.postId] = post;
    }

    if (post) {
      this.setState({ post });
    }
  }

  render() {
    if (this.state.post) {
      return (
        <div
          className={STYLES_POST_CELL_CONTAINER}
          style={{
            border: this.props.theme.embedBorder,
            background: this.props.theme.embedBackground,
            boxShadow: this.props.theme.embedBoxShadow,
            padding: this.props.theme.embedPadding,
          }}>
          <UIPostCell
            post={this.state.post}
            userPresence={this.props.userPresence}
            onGameSelect={this._handleNavigateToGame}
            onUserSelect={this._handleNavigateToUser}
            style={{ margin: 0 }}
            theme={this.props.theme}
          />
        </div>
      );
    }

    if (this.state.game) {
      let coverImage;
      if (this.state.game && this.state.game.coverImage) {
        coverImage = this.state.game.coverImage.url;
      }

      return (
        <div>
          <UIGameCell
            game={this.state.game}
            src={coverImage}
            onGameSelect={this._handleNavigateToGame}
            onUserSelect={this._handleNavigateToUser}
            theme={this.props.theme}
          />
        </div>
      );
    }

    let url = this.props.message.text;
    url = url.replace('castle://', 'http://');

    return (
      <div className={STYLES_OUTER}>
        <div className={STYLES_CONTAINER}>
          <div className={STYLES_SECTION}>
            <a className={STYLES_POST} href={url}>
              {this.props.message.text}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
