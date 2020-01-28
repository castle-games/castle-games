import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

const STYLES_CONTAINER = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_INDICATOR_CONTAINER = css`
  width: 12px;
  height: 12px;
  margin: 2px 4px 2px 0;
  border-radius: 6px;
`;

const Indicator = ({isOnline, isAnonymous, isMobileActive }) => {
  // to avoid showing ambiguous offline + active for mobile instances without chat,
  // show a mobile icon in this case
  if (isMobileActive) {
    return (
      <div>
        <SVG.Mobile size={12} />
      </div>
    );
  }

  // offline
  let indicatorStyle = { border: `2px solid ${Constants.colors.userStatus.offline}` };
  if (isOnline) {
    const color = isAnonymous
      ? Constants.colors.userStatus.guest
      : Constants.colors.userStatus.online;
    indicatorStyle = {
      border: `2px solid ${color}`,
      background: color,
    };
  }
  return <div className={STYLES_INDICATOR_CONTAINER} style={indicatorStyle} />;
};

const UIUserStatusIndicator = (props) => {
  const { user, isMobileActive, style } = props;
  const userPresence = React.useContext(UserPresenceContext);
  const isOnline = user.userId && userPresence.onlineUserIds[user.userId];
  const isAnonymous = user.isAnonymous;
  return (
    <div className={STYLES_CONTAINER} style={{ ...style }}>
      <Indicator isOnline={isOnline} isAnonymous={isAnonymous} isMobileActive={isMobileActive} />
    </div>
  );
};

export default UIUserStatusIndicator;
