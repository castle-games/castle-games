import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIGameGrid from '~/components/reusable/UIGameGrid';

const STYLES_GAME_PREVIEW = css`
  margin-top: 16px;
  background-color: ${Constants.colors.background3};
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
`;

const STYLES_GAME_PREVIEW_ERROR = css`
  color: ${Constants.colors.text};
`;

const STYLES_GAME_PREVIEW_ERROR_DETAIL = css`
  font-size: ${Constants.typescale.lvl6};
  color: ${Constants.colors.error};
  margin-top: 16px;
`;

const STYLES_GAME_PREVIEW_URL = css`
  text-decoration: underline;
  cursor: default;
`;

const STYLES_PARAGRAPH = css``;

export default class PublishGamePreview extends React.Component {
  static defaultProps = {
    game: null,
    error: null,
    isLoading: false,
    instructions: '',
  };

  render() {
    const { game, error, isLoading, instructions } = this.props;
    if (game && game.slug) {
      return (
        <div className={STYLES_GAME_PREVIEW}>
          <UIGameGrid gameItems={[game]} isPreview={true} />
          <div className={STYLES_PARAGRAPH}>
            Your Castle url will be <span className={STYLES_GAME_PREVIEW_URL}>{game.url}</span>
          </div>
        </div>
      );
    } else if (error) {
      return (
        <div className={STYLES_GAME_PREVIEW}>
          <div className={STYLES_GAME_PREVIEW_ERROR}>
            There was a problem previewing the game to publish:
          </div>
          <div className={STYLES_GAME_PREVIEW_ERROR_DETAIL}>{error}</div>
        </div>
      );
    } else if (isLoading) {
      return <div className={STYLES_GAME_PREVIEW}>Loading Game Preview...</div>;
    } else {
      return <div className={STYLES_GAME_PREVIEW}>{instructions}</div>;
    }
  }
}
