import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  border-bottom: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  color: ${Constants.REFACTOR_COLORS.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  flex-shrink: 0;
  padding: 16px 16px 8px 16px;
  overflow: hidden;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HEADER_LEFT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_HEADER_RIGHT = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const STYLES_H2 = css`
  font-size: 16px;
`;

const STYLES_P = css`
  margin-top: 4px;
  font-size: 12px;
  cursor: pointer;
`;

export default class ClientChatWindow extends React.Component {
  render() {
    return (
      <header className={STYLES_HEADER}>
        <div className={STYLES_HEADER_LEFT}>
          <h2 className={STYLES_H2}>#[bind-channel-name]</h2>
          <p className={STYLES_P}>
            <strong style={{ cursor: 'pointer' }}>[bind-member-count] online</strong>
          </p>
        </div>
        <div className={STYLES_HEADER_RIGHT}>Test</div>
      </header>
    );
  }
}
