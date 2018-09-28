import * as React from 'react';
import * as Constants from '~/common/constants';
import * as UISVG from '~/core-components/reusable/UISVG';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';
import ControlFeedbackPopover from '~/core-components/controls/ControlFeedbackPopover';

const STYLES_CONTAINER = css`
  padding: 16px;
  background: ${Constants.colors.yellow};
  color: ${Constants.colors.black};
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
`;

const STYLES_SECTION_PARAGRAPH = css`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
`;

export default class UICardMedia extends React.Component {
  render() {
    const name = this.props.media && this.props.media.name ? this.props.media.name : 'Untitled';
    const username =
      this.props.media && this.props.media.user ? this.props.media.user.username : 'Anonymous';
    const createdTime =
      this.props.media && this.props.media.published
        ? Strings.toDate(this.props.media.published)
        : 'Unknown publish date';

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTAINER_PREVIEW_NAME}>{name}</div>
        <div className={STYLES_BYLINE}>
          Created by {username} — {createdTime}
        </div>

        <div className={STYLES_SECTION}>
          <div className={STYLES_SECTION_TITLE}>Is this your game?</div>
          <div className={STYLES_SECTION_PARAGRAPH}>
            Castle lists all the games from a game jam, so people can browse and play them all
            easily. If you created this game and want to claim it, change the way it is presented,
            or remove it, please contact the Castle team and let us know.
          </div>

          <ControlFeedbackPopover onRegisterMedia={this.props.onRegisterMedia}>
            <UIButtonIconHorizontal style={{ marginTop: 24 }} icon={<UISVG.Mail height="16px" />}>
              Contact us
            </UIButtonIconHorizontal>
          </ControlFeedbackPopover>
        </div>
      </div>
    );
  }
}
