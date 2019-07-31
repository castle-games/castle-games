import * as React from 'react';
import * as GameSVG from '~/components/primitives/game-screen-svg';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  height: 48px;
  width: 100%;
  background: linear-gradient(to top, #cccccc 0%, #d6d6d6 1px, #ebebeb 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 0;
  color: #222;
  font-size: 12px;
`;

const STYLES_CHAT_FIELD = css`
  font-size: 14px;
  line-height: 14px;
  flex-shrink: 0;
  width: 188px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px 4px 16px;
  background: rgba(255, 255, 255, 0.8);
  color: #999;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  min-width: 200px;
`;

const STYLES_MIDDLE = css`
  width: 100%;
  min-width: 20%;
  text-align: center;
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
  min-width: 200px;
  text-align: right;
`;

const STYLES_CTA = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

const CTA = (props) => {
  return (
    <span
      className={STYLES_CTA}
      style={{ ...props.style, color: props.active ? 'magenta' : null }}
      onClick={props.onClick}>
      {props.children}
    </span>
  );
};

export default class GameScreenActionsBar extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CHAT_FIELD}>Message #pac-bois</div>
        <div className={STYLES_LEFT} style={{ paddingLeft: 16 }}>
          <CTA style={{ marginRight: 24 }}>
            <GameSVG.Volume height="20px" style={{ marginRight: 8 }} />
          </CTA>
        </div>
        <div className={STYLES_MIDDLE}>
          <CTA style={{ marginRight: 24 }}>
            <GameSVG.Camera height="32px" style={{ marginRight: 8 }} />
          </CTA>
        </div>
        <div className={STYLES_RIGHT}>
          <CTA style={{ marginRight: 24 }}>
            <GameSVG.Multiplayer height="20px" style={{ marginRight: 8 }} />
          </CTA>

          <CTA style={{ marginRight: 24 }}>
            <GameSVG.Chip height="20px" style={{ marginRight: 8 }} />
          </CTA>

          <CTA style={{ marginRight: 24 }}>
            <GameSVG.Source height="20px" style={{ marginRight: 8 }} />
          </CTA>

          <CTA>
            <GameSVG.Tools height="20px" style={{ marginRight: 8 }} />
          </CTA>
        </div>
      </div>
    );
  }
}
