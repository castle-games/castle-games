import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_ICON = css`
  height: 48px;
  width: 48px;
  background: ${Constants.colors.black};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px ${Constants.colors.white};
  border-radius: 4px;
  background-position: 50% 50%;
  background-size: cover;
`;

export default class UIAvatar extends React.Component {
  render() {
    const { src, icon } = this.props;
    const maybeIconChild = (!src && icon) ? icon : null;

    const avatarContextStyles = {
      backgroundImage: `url('${src}')`,
      cursor: this.props.onClick ? 'pointer' : null,
    };

    let maybeEmptyStyles = {};
    if (!maybeIconChild && !src) {
      maybeEmptyStyles = {
        backgroundColor: Constants.colors.white25,
      };
    }

    return (
      <span
        className={STYLES_ICON}
        onClick={this.props.onClick}
        style={{ ...this.props.style, ...avatarContextStyles, ...maybeEmptyStyles }}>
        {maybeIconChild}
      </span>
    );
  }
}
