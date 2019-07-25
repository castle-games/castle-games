import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_ROOT = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  background: ${Constants.REFACTOR_COLORS.gameBackground};
`;

const STYLES_TOP = css`
  min-height: 48px;
  width: 100%;
  flex-shrink: 0;
`;

const STYLES_BODY = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  min-height: 25%;
  width: 100%;
`;

const STYLES_CONTENT = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  min-width: 10%;
  height: 100%;
  width: 100%;
`;

const STYLES_HEADER = css`
  display: flex;
  height: 24px;
  width: 100%;
  flex-shrink: 0;
`;

const STYLES_MEDIA = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 10%;
  height: 100%;
  width: 100%;
`;

const STYLES_MEDIA_CONTAINER = css`
  display: flex;
  min-width: 10%;
  height: 100%;
  width: 100%;
`;

const STYLES_MEDIA_SIDEBAR = css`
  display: flex;
  width: 240px;
  height: 100%;
  flex-shrink: 0;
`;

const STYLES_ACTIONS = css`
  display: flex;
  height: 48px;
  width: 100%;
  flex-shrink: 0;
`;

const STYLES_DEVELOPER = css`
  display: flex;
  width: 288px;
  height: 100%;
  flex-shrink: 0;
`;

export default class GameScreenLayout extends React.Component {
  static defaultProps = {
    top: null,
  };

  render() {
    const { top, developer } = this.props;

    return (
      <div className={STYLES_ROOT}>
        {top ? <div className={STYLES_TOP}>{top}</div> : null}

        <div className={STYLES_BODY}>
          <div className={STYLES_CONTENT}>
            <div className={STYLES_HEADER}>&nbsp;</div>

            <div className={STYLES_MEDIA}>
              <div className={STYLES_MEDIA_SIDEBAR}>&nbsp;</div>
              <div className={STYLES_MEDIA_CONTAINER}>&nbsp;</div>
            </div>

            <div className={STYLES_ACTIONS}>&nbsp;</div>
          </div>

          {developer ? <div className={STYLES_DEVELOPER}>{developer}</div> : null}
        </div>
      </div>
    );
  }
}
