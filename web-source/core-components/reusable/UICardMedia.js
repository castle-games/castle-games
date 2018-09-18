import * as React from 'react';
import * as Constants from '~/common/constants';
import * as UISVG from '~/core-components/reusable/UISVG';
import * as Strings from '~/common/strings';

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
          <div className={STYLES_CONTAINER_PREVIEW_NAME}>{this.props.media.name}</div>
        </div>
        <div className={STYLES_BYLINE}>
          Created by {this.props.media.user.username} — {Strings.toDate(this.props.media.createdTime)}
        </div>

        <div className={STYLES_SECTION}>
          <div className={STYLES_SECTION_TITLE}>Is this your game?</div>
          <div className={STYLES_SECTION_PARAGRAPH}>
            Please let us know! In the future you will be able to create an account and add this
            game to your profile. You will be able to add your game's logo and write instructions
            for how to play.
          </div>

          <UIButtonIconHorizontal
            onClick={this.props.onRegisterMedia}
            style={{ marginTop: 24 }}
            icon={<UISVG.Mail height="16px" />}>
            Contact us
          </UIButtonIconHorizontal>
        </div>
      </div>
    );
  }
}
