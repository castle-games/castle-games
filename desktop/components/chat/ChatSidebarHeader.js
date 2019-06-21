import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_HEADER = css`
  color: ${Constants.colors.white};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HEADER_RIGHT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_HEADER_LEFT = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 200ms ease color;

  :hover {
    color: magenta;
  }
`;

export default class ChatHeader extends React.Component {
  render() {
    return (
      <header className={STYLES_HEADER} style={{ background: `#171717`}}>
        <div className={STYLES_HEADER_LEFT}>
          <UINavigationLink 
            style={{
              background: '#313131',
              padding: '0 24px 0 24px',
              height: 32,
              display: 'inline-flex',
              alignItems: 'center', 
            }} 
            onClick={this.props.onBackClick}>
            Back
          </UINavigationLink>
        </div>
          <UINavigationLink 
            style={{
              padding: '0 24px 0 24px',
              height: 32,
              display: 'inline-flex',
              alignItems: 'center', 
            }} 
            onClick={this.props.onThemeClick}>
            Toggle Theme
          </UINavigationLink>
      </header>
    );
  }
}
