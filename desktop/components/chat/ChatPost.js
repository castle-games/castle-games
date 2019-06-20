import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';

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

const STYLES_ACTIONS = css`
  margin-top: 8px;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
`;

const STYLES_ACTION_ITEM = css`
  margin-right: 24px;
  margin-top: 8px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  white-space: nowrap;
  color: ${Constants.colors.white};
  text-decoration: none;

  :hover {
    color: magenta;
  }
`;

const STYLES_ICON = css`
  background-color: ${Constants.REFACTOR_COLORS.text};
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  margin-right: 8px;
  background-size: cover;
  background-position: 50% 50%;
  border-radius: 2px;
`;

const STYLES_TEXT = css`
  font-family: ${Constants.font.mono};
  font-size: 10px;
  text-transform: uppercase;
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

export default class ChatPost extends React.Component {
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
      const game = await Actions.getGameByUrl(url);
      this.setState({ game });
      return;
    }

    const post = await Actions.getPostById(this.props.urlData.postId);
    if (post) {
      this.setState({ post });
    }
  }

  render() {
    if (this.state.post) {
      const { creator, sourceGame, message } = this.state.post;

      const gameMediaURL = this.state.post.media.url;

      let text = this.props.message.text;
      if (message && message.message[0]) {
        text = message.message[0].text;
      }

      return (
        <div className={STYLES_OUTER}>
          <div className={STYLES_CONTAINER} style={{ backgroundImage: `url(${gameMediaURL})` }}>
            <div className={STYLES_SECTION}>
              <div className={STYLES_POST} onClick={this._handleNavigateToGame}>
                {text}
              </div>
              <div className={STYLES_ACTIONS}>
                <div
                  className={STYLES_ACTION_ITEM}
                  onClick={() => this._handleNavigateToUser(creator)}>
                  <span
                    className={STYLES_ICON}
                    style={{ backgroundImage: `url(${creator.photo.url})` }}
                  />
                  <span className={STYLES_TEXT}>{creator.username}</span>
                </div>
                <span className={STYLES_ACTION_ITEM} onClick={this._handleNavigateToGame}>
                  <span
                    className={STYLES_ICON}
                    style={{ backgroundImage: `url(${sourceGame.coverImage.url})` }}
                  />
                  <span className={STYLES_TEXT}>{sourceGame.title}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.game) {
      return (
        <div className={STYLES_OUTER} onClick={this._handleNavigateToGame}>
          <div
            className={STYLES_CONTAINER}
            style={{ backgroundImage: `url(${this.state.game.coverImage.url})` }}>
            <div className={STYLES_SECTION}>
              <div className={STYLES_POST}>{this.state.game.title}</div>
            </div>
          </div>
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
