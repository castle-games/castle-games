import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css, styled } from 'react-emotion';

const STYLES_CONTAINER = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  padding: 8px 16px 8px 16px;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 40px;
  width: 40px;
  background-color: magenta;
  cursor: pointer;
  border-radius: 4px;
`;

const STYLES_RIGHT = css`
  padding-left: 12px;
  min-width: 15%;
  width: 100%;
`;

const STYLES_AUTHOR_NAME = css`
  cursor: pointer;
  margin-top: 2px;
  font-size: 13px;
  font-weight: 700;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const STYLES_TIMESTAMP = css`
  font-weight: 400;
  color: ${Constants.REFACTOR_COLORS.subdued};
  margin-left: 4px;
  font-size: 10px;
`;

const STYLES_AUTHOR_MESSAGE = css`
  line-height: 20px;
  font-size: 14px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${Constants.REFACTOR_COLORS.text};
`;

export default class ChatMessageElement extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <span className={STYLES_LEFT} onClick={this.props.onUserClick} />
        <span className={STYLES_RIGHT}>
          <div className={STYLES_AUTHOR_NAME} onClick={this.props.onUserClick}>
            Lao-tzu
            <span className={STYLES_TIMESTAMP}>8:30 PM</span>
          </div>
          <div className={STYLES_AUTHOR_MESSAGE}>
            So it is that existence and non-existence give birth the one to (the idea of) the other;
            that difficulty and ease produce the one (the idea of) the other; that length and
            shortness fashion out the one the figure of the other; that (the ideas of) height and
            lowness arise from the contrast of the one with the other; that the musical notes and
            tones become harmonious through the relation of one with another; and that being before
            and behind give the idea of one following another.
          </div>
        </span>
      </div>
    );
  }
}
