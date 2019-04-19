import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

import UIButton from '~/components/reusable/UIButton';
import UIHeading from '~/components/reusable/UIHeading';

const STYLES_CONTAINER = css`
  background: #c1bcbb;
`;

const STYLES_ACTIONS = css`
  display: flex;
  flex-wrap: nowrap;
`;

const STYLES_ACTION = css`
  font-family: ${Constants.font.system};
  color: ${Constants.colors.black};
  border-right: 1px solid #c1bcbb;
  background-color: #ffffff;
  flex-shrink: 0;
  padding: 16px 32px 16px 24px;
  cursor: pointer;
  transition: 200ms ease all;

  :hover {
    color: magenta;
    background-color: #f2f2f2;
  }
`;

const STYLES_ACTION_HEADING = css`
  font-family: ${Constants.font.heading};
  font-size: 14px;
`;

const STYLES_ACTION_PARAGRAPH = css`
  line-height: 1.5;
  font-size: 12px;
  margin-top: 4px;
`;

export default class HomeMakeBanner extends React.Component {
  static defaultProps = {
    navigateToCreate: () => {},
    navigateToGameUrl: async (url) => {},
  };

  _handleClickExamples = () => {
    NativeUtil.openExternalURL(`${Constants.WEB_HOST}/examples`);
  };

  _handleAddProfile = () => {};

  _handleClickDiscord = () => {
    NativeUtil.openExternalURL('https://discordapp.com/invite/4C7yEEC');
  };

  _handleClickTutorial = () => {
    NativeUtil.openExternalURL(`${Constants.WEB_HOST}/documentation`);
  };

  _handleCreateProject = () => {
    this.props.navigateToCreate();
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
          <div className={STYLES_ACTION} onClick={this._handleCreateProject}>
            <div className={STYLES_ACTION_HEADING}>New project</div>
            <div className={STYLES_ACTION_PARAGRAPH} style={{ color: Constants.colors.black }}>
              Create a new blank project.
            </div>
          </div>
          <div className={STYLES_ACTION} onClick={this._handleOpenProject}>
            <div className={STYLES_ACTION_HEADING}>Open project</div>
            <div className={STYLES_ACTION_PARAGRAPH} style={{ color: Constants.colors.black }}>
              Open a project on your computer.
            </div>
          </div>
          <div className={STYLES_ACTION} onClick={this._handleClickTutorial}>
            <div className={STYLES_ACTION_HEADING}>Documentation</div>
            <div className={STYLES_ACTION_PARAGRAPH} style={{ color: Constants.colors.black }}>
              Read tutorials and examples.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
