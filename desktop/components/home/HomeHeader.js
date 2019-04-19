import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

import UIButton from '~/components/reusable/UIButton';
import UIHeading from '~/components/reusable/UIHeading';

const STYLES_CONTAINER = css`
  flex-grow: 1;
`;

const STYLES_ACTIONS = css`
  display: flex;
  flex-wrap: nowrap;
`;

const STYLES_ACTION = css`
  font-family: ${Constants.font.system};
  color: ${Constants.colors.black};
  flex-shrink: 0;
  padding: 16px 32px 16px 24px;
  cursor: pointer;
  transition: 200ms ease all;

  :hover {
    color: ${Constants.colors.brand2};
  }
`;

const STYLES_ACTION_HEADING = css`
  font-family: ${Constants.font.heading};
  font-size: 24px;
`;

export default class HomeHeader extends React.Component {
  static defaultProps = {
    navigateToCreate: () => {},
    navigateToHome: () => {},
    navigateToGameUrl: async (url) => {},
  };

  _handleCreateProject = () => {
    this.props.navigateToCreate();
  };

  _handleHome = () => {
    this.props.navigateToHome();
  };

  _handleOpenProject = async () => {
    try {
      const path = await NativeUtil.chooseOpenProjectPathWithDialogAsync();
      if (path) {
        await this.props.navigateToGameUrl(`file://${path}`);
      }
    } catch (_) {}
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_ACTIONS}>
          <div className={STYLES_ACTION} onClick={this._handleHome}>
            <div
              className={STYLES_ACTION_HEADING}
              style={{ color: this.props.mode === 'home' ? 'magenta' : null }}>
              Play
            </div>
          </div>
          <div className={STYLES_ACTION} onClick={this._handleCreateProject}>
            <div
              className={STYLES_ACTION_HEADING}
              style={{ color: this.props.mode === 'create' ? 'magenta' : null }}>
              Create Game
            </div>
          </div>
        </div>
      </div>
    );
  }
}
