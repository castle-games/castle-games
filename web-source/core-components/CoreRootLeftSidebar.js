import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import UIButtonIcon from '~/core-components/reusable/UIButtonIcon';

const STYLES_NAVIGATION = css`
  @keyframes sidebar-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: sidebar-animation 280ms ease;
  background: ${Constants.colors.background};
  height: 100%;
  padding: 8px;
  border-right: 1px solid ${Constants.colors.border};
`;

export default class CoreRootLeftSidebar extends React.Component {
  render() {
    return (
      <div className={STYLES_NAVIGATION}>
        <UIButtonIcon
          active={this.props.isPlaying}
          icon={<SVG.Play height="14px" />}
          style={{ background: Constants.colors.blue }}
          onClick={this.props.onTogglePlay}>
          Playing
        </UIButtonIcon>
        <UIButtonIcon
          active={this.props.isBrowsing}
          icon={<SVG.Search height="20px" />}
          style={{ background: Constants.colors.red }}
          onClick={this.props.onToggleBrowse}>
          Browse
        </UIButtonIcon>
        <UIButtonIcon
          active={this.props.isViewingHistory}
          icon={<SVG.History height="20px" />}
          style={{background: Constants.colors.blue }}
          onClick={this.props.onToggleHistory}>
          History
        </UIButtonIcon>
        {this.props.viewer ? (
          <UIButtonIcon
            active={this.props.isViewingProfile}
            icon={<SVG.Rook height="20px" />}
            style={{ background: Constants.colors.green }}
            onClick={this.props.onToggleProfile}>
            You
          </UIButtonIcon>
        ) : null}
        {!this.props.viewer ? (
          <UIButtonIcon
            active={this.props.isSignIn}
            icon={<SVG.Login height="20px" />}
            style={{ background: Constants.colors.green }}
            onClick={this.props.onToggleSignIn}>
            Sign in
          </UIButtonIcon>
        ) : null}
        {this.props.viewer ? (
          <UIButtonIcon
            style={{ background: Constants.colors.purple }}
            icon={<SVG.Logout height="20px" />}
            onClick={this.props.onSignOut}>
            Sign out
          </UIButtonIcon>
        ) : null}
      </div>
    );
  }
}
