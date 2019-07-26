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
  width: 188px;
  height: 100%;
  flex-shrink: 0;
`;

const STYLES_ACTIONS = css`
  display: flex;
  width: 100%;
  flex-shrink: 0;
`;

const STYLES_DEVELOPER = css`
  display: flex;
  width: 428px;
  height: 100%;
  flex-shrink: 0;
`;

// TODO(jim): Support fluid resize of components.
// TODO(jim): Connect data.
export default class GameScreenLayout extends React.Component {
  static defaultProps = {
    elementActions: null,
    elementAlert: null,
    elementDeveloper: null,
    elementGame: null,
    elementGameSidebar: null,
    elementHeader: null,
  };

  render() {
    const {
      elementActions,
      elementAlert,
      elementDeveloper,
      elementGame,
      elementGameSidebar,
      elementHeader,
    } = this.props;

    return (
      <div className={STYLES_ROOT}>
        {elementAlert ? <div className={STYLES_TOP}>{elementAlert}</div> : null}

        <div className={STYLES_BODY}>
          <div className={STYLES_CONTENT}>
            {elementHeader ? <div className={STYLES_HEADER}>{elementHeader}</div> : null}

            <div className={STYLES_MEDIA}>
              <div className={STYLES_MEDIA_SIDEBAR}>{elementGameSidebar}</div>
              <div className={STYLES_MEDIA_CONTAINER}>{elementGame}</div>
            </div>

            {elementActions ? <div className={STYLES_ACTIONS}>{elementActions}</div> : null}
          </div>

          {elementDeveloper ? <div className={STYLES_DEVELOPER}>{elementDeveloper}</div> : null}
        </div>
      </div>
    );
  }
}
