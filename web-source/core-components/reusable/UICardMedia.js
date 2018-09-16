import * as React from 'react';
import * as Constants from '~/common/constants';
import * as UISVG from '~/core-components/reusable/UISVG';

import { css } from 'react-emotion';

import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';

const STYLES_CONTAINER = css`
  padding: 16px;
  border-top: 1px solid ${Constants.colors.white20};
  border-radius: 2px;
  background: #d20014;
  color: ${Constants.colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const STYLES_CONTAINER_PREVIEW = css`
  padding: 16px;
  border-radius: 4px;
  border: 1px solid ${Constants.colors.white20};
`;

const STYLES_CONTAINER_PREVIEW_LABEL = css`
  font-size: 10px;
  margin-bottom: 16px;
  font-weight: 600;
`;

const STYLES_CONTAINER_PREVIEW_NAME = css`
  font-size: 48px;
  font-weight: 700;
`;

const STYLES_BYLINE = css`
  margin-top: 8px;
  font-size: 10px;
  margin-bottom: 24px;
`;

const STYLES_SECTION = css`
  margin-top: 24px;
`;

const STYLES_SECTION_TITLE = css`
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid ${Constants.colors.white20};
`;

const STYLES_SECTION_PARAGRAPH = css`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
`;

export default class UICardMedia extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTAINER_PREVIEW}>
          <div className={STYLES_CONTAINER_PREVIEW_LABEL}>Name</div>
          <div className={STYLES_CONTAINER_PREVIEW_NAME}>Untitled</div>
        </div>
        <div className={STYLES_BYLINE}>Anonymous — Unknown upload date</div>

        <div className={STYLES_SECTION}>
          <div className={STYLES_SECTION_TITLE}>Register</div>
          <div className={STYLES_SECTION_PARAGRAPH}>
            By registering this game, you can add a description, instructions, and other users can
            add this game to their playlists.
          </div>

          <UIButtonIconHorizontal
            onClick={this.props.onRegisterMedia}
            style={{ marginTop: 24 }}
            icon={<UISVG.Add height="16px" />}>
            Register game
          </UIButtonIconHorizontal>
        </div>
      </div>
    );
  }
}
