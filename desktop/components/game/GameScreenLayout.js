import * as React from 'react';

import { css } from 'react-emotion';

const STYLES_TOP = css`
  display: flex;
`;

const STYLES_ROOT = css`
  display: flex;
`;

const STYLES_BODY = css`
  display: flex;
`;

const STYLES_CONTENT = css`
  display: flex;
`;

const STYLES_HEADER = css`
  display: flex;
`;

const STYLES_MEDIA = css`
  display: flex;
`;

const STYLES_MEDIA_LEFT = css`
  display: flex;
`;

const STYLES_MEDIA_RIGHT = css`
  display: flex;
`;

const STYLES_ACTIONS = css`
  display: flex;
`;

const STYLES_DEVELOPER = css`
  display: flex;
`;

export default class GameScreenLayout extends React.Component {
  render() {
    return (
      <div className={STYLES_ROOT}>
        <div className={STYLES_TOP}>&nbsp;</div>

        <div className={STYLES_BODY}>
          <div className={STYLES_CONTENT}>
            <div className={STYLES_HEADER}>&nbsp;</div>

            <div className={STYLES_MEDIA}>
              &nbsp;
              <div className={STYLES_MEDIA_LEFT}>&nbsp;</div>
              <div className={STYLES_MEDIA_MIDDLE}>&nbsp;</div>
            </div>

            <div className={STYLES_ACTIONS}>&nbsp;</div>
          </div>

          <div className={STYLES_DEVELOPER}>&nbsp;</div>
        </div>
      </div>
    );
  }
}
