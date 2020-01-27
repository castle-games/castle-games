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

const Indicator = ({ isOnline, isAnonymous, showIndicator, indicatorStyle, indicatorCount }) => {
  if (!showIndicator) return null;

  let backgroundColor;
  if (isOnline) {
    backgroundColor = isAnonymous
      ? Constants.colors.userStatus.guest
      : Constants.REFACTOR_COLORS.online;
  } else {
    backgroundColor = '#ACACAC';
  }
  const styles = {
    backgroundColor,
    ...indicatorStyle,
  };
  return (
    <div className={STYLES_INDICATOR} style={styles}>
      {indicatorCount > 0 ? indicatorCount : ''}
    </div>
  );
}

const UIAvatar = ({ src, style = null, isOnline = false, isAnonymous = false, showIndicator = true, onClick, indicatorStyle = null, indicatorCount = 0 }) => {
    const avatarContextStyles = {
      backgroundImage: `url('${src}')`,
      cursor: onClick ? 'pointer' : null,
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
        style={{ ...avatarContextStyles, ...maybeEmptyStyles, ...style }}>
        <Indicator
          isOnline={isOnline}
          isAnonymous={isAnonymous}
          showIndicator={showIndicator}
          indicatorStyle={indicatorStyle}
          indicatorCount={indicatorCount}
        />
      </figure>
    );
  }

export default UIAvatar;
