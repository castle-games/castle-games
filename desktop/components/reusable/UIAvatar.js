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
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  color: white;
  font-size: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0px;
`;

const STYLES_AVATAR = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 20px;
  width: 20px;
  position: relative;
  border-radius: 4px;
`;

export default class UIAvatar extends React.Component {
  static defaultProps = {
    isOnline: false,
    showIndicator: true,
    style: null,
    indicatorStyle: null,
    indicatorCount: 0,
  };

  _renderIndicator = (isOnline, showIndicator) => {
    if (!showIndicator) return null;

    const styles = {
      background: isOnline ? Constants.REFACTOR_COLORS.online : '#ACACAC',
      ...this.props.indicatorStyle,
    };
    return (
      <div className={STYLES_INDICATOR} style={styles}>
        {this.props.indicatorCount > 0 ? this.props.indicatorCount : ''}
      </div>
    );
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
