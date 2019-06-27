import * as React from 'react';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { Tooltip } from 'react-tippy';

const STYLES_OPTIONS_BAR = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(0, 0, 0, 0.95);
  color: #7f7f7f;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #333;
  height: 32px;
  top: 8px;
  right: 8px;
  position: absolute;
  cursor: pointer;
`;

const STYLES_OPTIONS_BAR_ICON = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  :hover {
    color: magenta;
  }
`;

const STYLES_COPY_LINK_CONTENTS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  height: 36px;
`;

export default class UIGameCellActionsBar extends React.Component {
  static defaultProps = {
    isLocalFile: false,
    isShowingInfo: false,
    didCopyToClipboard: false,
    onShowGameInfo: (showInfo) => {},
    onCopyUrl: () => {},
    onHover: (action, isHovering) => {},
  };

  render() {
    const { isLocalFile, isShowingInfo, didCopyToClipboard, onHover } = this.props;
    return (
      <div className={STYLES_OPTIONS_BAR}>
        {!isLocalFile ? (
          <Tooltip
            title={isShowingInfo ? 'Show preview' : 'Show info'}
            arrow={true}
            duration={170}
            animation="fade"
            hideOnClick={false}>
            <div
              className={STYLES_OPTIONS_BAR_ICON}
              onMouseEnter={() => onHover('info', true)}
              onMouseLeave={() => onHover('info', false)}
              onClick={() => this.props.onShowGameInfo(!isShowingInfo)}>
              {isShowingInfo ? <SVG.Image size="14px" /> : <SVG.Info height="14px" />}
            </div>
          </Tooltip>
        ) : null}
        <Tooltip
          title={didCopyToClipboard ? 'Link copied!' : 'Copy Link'}
          arrow={true}
          duration={170}
          animation="fade"
          hideOnClick={false}>
          <div
            className={STYLES_OPTIONS_BAR_ICON}
            style={{ borderLeft: isLocalFile ? null : '1px solid #333' }}
            onMouseEnter={() => onHover('copy-url', true)}
            onMouseLeave={() => onHover('copy-url', false)}
            onClick={this.props.onCopyUrl}>
            {didCopyToClipboard ? (
              <div className={STYLES_COPY_LINK_CONTENTS}>
                <SVG.Check size="18px" />
              </div>
            ) : (
              <div className={STYLES_COPY_LINK_CONTENTS}>
                <SVG.Link size="18px" />
              </div>
            )}
          </div>
        </Tooltip>
      </div>
    );
  }
}
