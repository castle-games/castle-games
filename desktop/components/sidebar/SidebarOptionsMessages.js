import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';
import * as Actions from '~/common/actions';

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
  margin-bottom: 8px;
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
  color: ${Constants.REFACTOR_COLORS.subdued};
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  text-align: right;
  padding: 0 16px 0 16px;
  margin-bottom: 8px;
`;

export default class SidebarOptionsMessages extends React.Component {
  async componentDidMount() {
    const response = await Actions.getAllUsers();
    this.props.social.addUsers(response);
  }

  render() {
    const { viewer } = this.props;

    let users = [];
    if (this.props.social.users && this.props.social.users.length) {
      users = this.props.social.users;
    }

    return (
      <React.Fragment>
        <header className={STYLES_HEADER}>
          <div className={STYLES_HEADER_LEFT} />
          <div className={STYLES_HEADER_RIGHT} onClick={this.props.onDismiss}>
            <SVG.Dismiss size="16px" />
          </div>
        </header>
        <div className={STYLES_TITLE}>Send a message</div>
        {users.map((u) => {
          if (u.username === viewer.username) {
            return null;
          }

          return (
            <div
              key={`username-${u.userId}`}
              className={STYLES_OPTION}
              onClick={() => this.props.onSendMessage(u)}>
              {u.name}
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}
