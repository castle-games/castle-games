import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.system};
  background: ${Constants.brand.yellow};
  color: ${Constants.colors.text};
  font-size: 12px;
  font-weight: 700;
`;

const STYLES_CONTENT = css`
  padding: 8px 8px 8px 8px;
`;

const STYLES_ACTIONS = css`
  padding: 8px 8px 8px 8px;
  display: flex;
  margin-top: 16px;
  align-items: center;
  justify-content: flex-start;
  background: #d99e0b;
`;

const STYLES_VERSION = css`
  font-family: ${Constants.font.monobold};
  font-size: 10px;
  text-transform: uppercase;
  margin-top: 4px;
`;

export default class HomeUpdateBanner extends React.Component {
  static defaultProps = {
    updateAvailable: {},
    onNativeUpdateInstall: (shouldInstall) => {},
  };

  state = {
    updating: false,
  };

  _handleUpdate = () => {
    this.setState({
      updating: true,
    });
    return this.props.onNativeUpdateInstall(true);
  };

  _renderDetails = () => {
    let detailsElement;
    const { versionString, dateString } = this.props.updateAvailable;
    if (versionString && dateString) {
      return (
        <div className={STYLES_VERSION}>
          Version {versionString} // {dateString}
        </div>
      );
    }
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        {!this.state.updating ? (
          <div className={STYLES_CONTENT}>
            <div>A new version of Castle is available!</div>
            {this._renderDetails()}
          </div>
        ) : (
          <div className={STYLES_CONTENT}>Updating...</div>
        )}
        {!this.state.updating ? (
          <div className={STYLES_ACTIONS}>
            <UINavigationLink style={{ marginRight: 24 }} onClick={this._handleUpdate}>
              Update Castle
            </UINavigationLink>
            <UINavigationLink onClick={() => this.props.onNativeUpdateInstall(false)}>
              Later
            </UINavigationLink>
          </div>
        ) : null}
      </div>
    );
  }
}
