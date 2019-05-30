import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

const STYLES_OUTER = css`
  flex-shrink: 0;
  width: 100%;
  padding: 16px;
  max-width: 420px;
  height: 236px;
`;

const STYLES_CONTAINER = css`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  border-radius: 4px 4px 4px 4px;
  background-color: magenta;
  background-size: cover;
  background-position: 50% 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  transition: 200ms ease all;
  transition-property: transform;
  color: white;

  :hover {
    transform: scale(1.025);
    cursor: pointer;
  }
`;

const STYLES_SECTION = css`
  font-family: 'game-heading';
  font-size: 18px;
  height: 100%;
  width: 100%;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 0px 0px 4px 4px;
  line-height: 1.5;
  background: linear-gradient(transparent, ${Constants.REFACTOR_COLORS.text});
`;

const STYLES_ACTIONS = css`
  margin-top: 8px;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
`;

const STYLES_ACTION_ITEM = css`
  margin-right: 24px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  :hover {
    color: magenta;
  }
`;

const STYLES_ICON = css`
  background-color: ${Constants.REFACTOR_COLORS.text};
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  margin-right: 8px;
  background-size: cover;
  background-position: 50% 50%;
  border-radius: 2px;
`;

const STYLES_TEXT = css`
  font-family: ${Constants.font.mono};
  font-size: 10px;
  text-transform: uppercase;
`;

const STYLES_POST = css`
  cursor: pointer;

  :hover {
    color: magenta;
  }
`;

export default class ChatPost extends React.Component {
  render() {
    return (
      <div className={STYLES_OUTER}>
        <div className={STYLES_CONTAINER}>
          <div className={STYLES_SECTION}>
            <div className={STYLES_POST}>This is where text would appear.</div>
            <div className={STYLES_ACTIONS}>
              <div className={STYLES_ACTION_ITEM}>
                <span className={STYLES_ICON} />
                <span className={STYLES_TEXT}>Cake Killers</span>
              </div>
              <div className={STYLES_ACTION_ITEM}>
                <span className={STYLES_ICON} />
                <span className={STYLES_TEXT}>Cake Flocks</span>
              </div>
              <div className={STYLES_ACTION_ITEM}>
                <span className={STYLES_TEXT}>March 14th, 2013</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
