import * as React from 'react';
import * as SVG from '~/components/primitives/svg';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIButtonIconHorizontal from '~/components/reusable/UIButtonIconHorizontal';

const STYLES_CONTAINER = css`
  color: ${Constants.colors.black};
  border-top: 16px solid ${Constants.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_CONTENT = css`
  max-width: 480px;
  padding: 64px 32px 32px 32px;
  flex-direction: column;
  box-sizing: border-box;
`;

const STYLES_PARAGRAPH = css`
  font-size: 14px;
  margin-bottom: 16px;
`;

export default class SignOut extends React.Component {
  render() {
    const icon = (<SVG.Logout height="16px" />);
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENT}>
          <div className={STYLES_PARAGRAPH}>
            Are you sure you want to sign out of Castle?
          </div>
          <UIButtonIconHorizontal
            onClick={this.props.onSignOut}
            icon={icon}>
            Sign out
          </UIButtonIconHorizontal>
        </div>
      </div>
    );
  }
}