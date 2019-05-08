import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

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

const STYLES_GAME_COVER = css`
  background-color: black;
  background-size: cover;
  background-position: 50% 50%;
  height: 108px;
  width: 160px;
  flex-shrink: 0;
  margin-right: 16px;
`;

const STYLES_URL_PLACEHOLDER = css`
  color: ${Constants.colors.text2};
`;

const STYLES_GAME_PREVIEW_ITEM_CONTAINER = css`
  margin-bottom: 16px;
  cursor: default;
`;

const STYLES_GAME_PREVIEW_ITEM_NAME = css`
  font-size: ${Constants.typescale.lvl7};
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 4px;
`;

const STYLES_GAME_PREVIEW_ITEM_DESC = css`
  padding-left: 8px;
  color: ${Constants.colors.text};
`;

const STYLES_GAME_PREVIEW_ITEM_EMPTY = css`
  padding-left: 8px;
  color: ${Constants.colors.text2};
`;

const STYLES_POINTER = css`
  cursor: pointer;
  text-decoration: underline;
`;

export default class PublishGamePreview extends React.Component {
  static defaultProps = {
    existingGameId: null,
    game: null,
    error: null,
    isLoading: false,
    instructions: '',
    isCastleHosted: false,
  };

  _formatPreviewUrl = (url, existingGameId) => {
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
    let containerClassName, onClickLink;
    if (existingGameId) {
      containerClassName = STYLES_POINTER;
      onClickLink = () => NativeUtil.openExternalURL(url);
    }
    if (suffix) {
      return (
        <span className={containerClassName} onClick={onClickLink}>
          {prefix}
          <span className={STYLES_URL_PLACEHOLDER}>id</span>
          {suffix}
        </span>
      );
    } else {
      return (
        <span className={containerClassName} onClick={onClickLink}>
          {prefix}
        </span>
      );
    }
  };

  _renderPreviewInfoItem = (name, info, style) => {
    let infoElement;
    if (info) {
      infoElement = <div className={STYLES_GAME_PREVIEW_ITEM_DESC}>{info}</div>;
    } else {
      infoElement = <div className={STYLES_GAME_PREVIEW_ITEM_EMPTY}>Empty</div>;
    }
    return (
      <div className={STYLES_GAME_PREVIEW_ITEM_CONTAINER} style={style}>
        <div className={STYLES_GAME_PREVIEW_ITEM_NAME}>{name}</div>
        {infoElement}
      </div>
    );
  };

  _renderPreviewInfo = () => {
    const { game, existingGameId } = this.props;
    return (
      <React.Fragment>
        {this._renderPreviewInfoItem('Title', game.title)}
        {this._renderPreviewInfoItem('Description', game.description)}
        {this._renderPreviewInfoItem('Uploaded source url', this._formatPreviewUrl(game.sourceUrl))}
        {this._renderPreviewInfoItem(
          'Published url',
          this._formatPreviewUrl(game.url, existingGameId),
          { marginBottom: 0 }
        )}
      </React.Fragment>
    );
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
            <div className={STYLES_GAME_PREVIEW_INFO}>{this._renderPreviewInfo()}</div>
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
