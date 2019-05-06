import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  margin-top: 16px;
  background-color: ${Constants.colors.background3};
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
`;

const STYLES_GAME_PREVIEW = css`
  display: flex;
`;

const STYLES_GAME_PREVIEW_ERROR = css`
  color: ${Constants.colors.text};
`;

const STYLES_GAME_PREVIEW_ERROR_DETAIL = css`
  font-size: ${Constants.typescale.lvl6};
  color: ${Constants.colors.error};
  margin-top: 16px;
`;

const STYLES_GAME_PREVIEW_INFO = css`
  width: 100%;
`;

const STYLES_GAME_PREVIEW_URL = css`
  text-decoration: underline;
  cursor: default;
`;

const STYLES_GAME_COVER = css`
  background-color: black;
  background-size: cover;
  background-position: 50% 50%;
  height: 108px;
  width: 160px;
  flex-shrink: 0;
  margin-right: 16px;
`;

const STYLES_GAME_TITLE = css`
  font-size: ${Constants.typescale.lvl6};
  line-height ${Constants.typescale.lvl6};
  color: ${Constants.colors.text};
  font-weight: 700;
  margin-bottom: 16px;
`;

const STYLES_URL_PLACEHOLDER = css`
  color: ${Constants.colors.text2};
`;

const STYLES_PARAGRAPH = css`
  line-height: ${Constants.linescale.lvl3};
`;

export default class PublishGamePreview extends React.Component {
  static defaultProps = {
    game: null,
    error: null,
    isLoading: false,
    instructions: '',
  };

  _renderPreviewUrl = (url) => {
    const placeholders = ['[GAME ID]', '[PUBLISH ID]'];
    let prefix = url,
      suffix;
    for (let ii = 0, nn = placeholders.length; ii < nn; ii++) {
      const placeholder = placeholders[ii];
      const index = url.indexOf(placeholder);
      if (index !== -1) {
        prefix = url.substr(0, index);
        suffix = url.substr(index + placeholder.length);
        break;
      }
    }
    if (prefix.startsWith('https://')) {
      prefix = prefix.substr(8);
    }
    if (suffix) {
      return (
        <span>
          {prefix}
          <span className={STYLES_URL_PLACEHOLDER}>id</span>
          {suffix}
        </span>
      );
    } else {
      return <span>{prefix}</span>;
    }
  };

  render() {
    const { game, error, isLoading, instructions } = this.props;
    if (game && game.slug) {
      const coverSrc = game.coverImage ? game.coverImage.url : null;
      return (
        <div className={STYLES_CONTAINER}>
          <div className={STYLES_GAME_PREVIEW}>
            <div
              className={STYLES_GAME_COVER}
              style={{ backgroundImage: coverSrc ? `url(${coverSrc})` : null }}
            />
            <div className={STYLES_GAME_PREVIEW_INFO}>
              <div className={STYLES_GAME_TITLE}>{game.title}</div>
              <div className={STYLES_PARAGRAPH}>
                Castle will upload your game files to{' '}
                <span className={STYLES_GAME_PREVIEW_URL}>
                  {this._renderPreviewUrl(game.sourceUrl)}
                </span>{' '}
                and create a url you can play at{' '}
                <span className={STYLES_GAME_PREVIEW_URL}>{this._renderPreviewUrl(game.url)}</span>.
              </div>
            </div>
          </div>
        </div>
      );
    } else if (error) {
      return (
        <div className={STYLES_CONTAINER}>
          <div className={STYLES_GAME_PREVIEW_ERROR}>
            There was a problem previewing the game to publish:
          </div>
          <div className={STYLES_GAME_PREVIEW_ERROR_DETAIL}>{error}</div>
        </div>
      );
    } else if (isLoading) {
      return <div className={STYLES_CONTAINER}>Loading Game Preview...</div>;
    } else {
      return <div className={STYLES_CONTAINER}>{instructions}</div>;
    }
  }
}
