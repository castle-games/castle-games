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
`;

const STYLES_ACTION_ITEM = css`
  margin-right: 24px;
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

  _handleNavigateToUser = async ({ username }) => {
    let user = this.props.social.usernameToUser[username];

    if (!user) {
      let response = await Actions.getUserByUsername({ username });

      if (!response) {
        return;
      }

      user = response;
    }

    this.props.navigator.navigateToUserProfile(user);
  };

  _handleNavigateToGame = () => {
    const { post } = this.state;

    this.props.navigator.navigateToGame(post.sourceGame, { post });
  };

  async componentDidMount() {
    if (!this.props.urlData.postId) {
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
                  onClick={() => this._handleNavigateToUser({ username: creator.username })}>
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

    return (
      <div className={STYLES_OUTER}>
        <div className={STYLES_CONTAINER}>
          <div className={STYLES_SECTION}>
            <a className={STYLES_POST} href={this.props.message.text}>
              {this.props.message.text}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
