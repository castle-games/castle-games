import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  border-bottom: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  color: ${Constants.REFACTOR_COLORS.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  flex-shrink: 0;
  padding: 8px 8px 8px 8px;
  margin-bottom: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HEADER_LEFT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_HEADER_RIGHT = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 200ms ease color;
  padding: 8px;

  :hover {
    color: magenta;
  }
`;

const STYLES_OPTION = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  user-select: none;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: right;
  padding: 0 16px 0 16px;
  width: 100%;
  cursor: pointer;
  transition: color 200ms ease;

  :hover {
    color: magenta;
  }
`;

const STYLES_TITLE = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  color: ${Constants.REFACTOR_COLORS.subdued};
  text-align: right;
  padding: 0 16px 0 16px;
  margin-bottom: 8px;
`;

export default class SidebarOptionsChannels extends React.Component {
  _handleSubmitChannel = () => {
    this.props.onAddChannel();
  };

  render() {
    return (
      <React.Fragment>
        <header className={STYLES_HEADER}>
          <div className={STYLES_HEADER_LEFT} />
          <div className={STYLES_HEADER_RIGHT} onClick={this.props.onDismiss}>
            <SVG.Dismiss size="16px" />
          </div>
        </header>
        {this.props.viewer ? <div className={STYLES_TITLE}>Add channel</div> : null}
        {this.props.viewer ? <div className={STYLES_TITLE}>Find a channel</div> : null}
        <div>
          {this.props.channels.map((c) => {
            console.log(c);
            return (
              <div
                key={`sidebar-options-${c.id}`}
                className={STYLES_OPTION}
                style={{ marginBottom: 8 }}
                onClick={() => this.props.onSelectChannel(c)}>
                {c.name}
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}
