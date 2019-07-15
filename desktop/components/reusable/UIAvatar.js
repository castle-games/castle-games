import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_INDICATOR = css`
  height: 12px;
  width: 12px;
  border-radius: 16px;
  flex-shrink: 0;
  position: absolute;
  right: -4px;
  bottom: -4px;
  border: 2px solid ${Constants.REFACTOR_COLORS.elements.channels};
`;

const STYLES_AVATAR = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  background-color: magenta;
  height: 20px;
  width: 20px;
  position: relative;
  border-radius: 4px;
`;

export default class UIAvatar extends React.Component {
  static defaultProps = {
    isOnline: false,
    showIndicator: true,
  };

  _renderIndicator = (isOnline, showIndicator) => {
    if (!showIndicator) return null;

    if (isOnline) {
      return (
        <span
          className={STYLES_INDICATOR}
          style={{ background: Constants.REFACTOR_COLORS.online }}
        />
      );
    } else {
      return <span className={STYLES_INDICATOR} style={{ background: '#ACACAC' }} />;
    }
  };

  render() {
    const { src, isOnline, showIndicator, onClick } = this.props;

    const avatarContextStyles = {
      backgroundImage: `url('${src}')`,
      cursor: this.props.onClick ? 'pointer' : null,
    };

    let maybeEmptyStyles = {};
    if (!src) {
      maybeEmptyStyles = {
        backgroundColor: Constants.colors.black25,
      };
    }

    return (
      <figure
        onClick={onClick}
        className={STYLES_AVATAR}
        style={{ ...avatarContextStyles, ...maybeEmptyStyles, ...this.props.style }}>
        {this._renderIndicator(isOnline, showIndicator)}
      </figure>
    );
  }
}
