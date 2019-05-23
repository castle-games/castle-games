import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  padding: 16px 16px 16px 16px;
  min-height: 64px;
  width: 100%;
  flex-shrink: 0;
  color: ${Constants.colors.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
`;

const STYLES_HEADING = css`
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;

  :hover {
    color: magenta;
  }
`;

const STYLES_AUTH = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const STYLES_AVATAR = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 20px;
  width: 20px;
  margin-top: 8px;
  background-color: magenta;
  border-radius: 4px;
  cursor: pointer;
`;

const STYLES_BYLINE = css`
  padding-left: 8px;
  min-width: 10%;
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  margin-top: 10px;

  strong {
    cursor: pointer;
    transition: 200ms ease color;

    :hover {
      color: magenta;
    }
  }
`;

export default class ChatSidebarHeader extends React.Component {
  render() {
    return (
      <header className={STYLES_HEADER}>
        <h2 className={STYLES_HEADING}>
          [bind server name] <SVG.Menu size="14px" style={{ margin: '0 0 0 6px' }} />
        </h2>
        <div className={STYLES_AUTH}>
          <span className={STYLES_AVATAR} />
          <span className={STYLES_BYLINE}>
            Signed in as <strong style={{ cursor: 'pointer' }}>[bind current user]</strong>
          </span>
        </div>
      </header>
    );
  }
}
