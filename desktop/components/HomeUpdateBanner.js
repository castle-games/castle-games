import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.system};
  background: ${Constants.brand.yellow};
  color: ${Constants.colors.text};
  font-size: 16px;
  user-select: none;
`;

const STYLES_CONTENT = css`
  padding: 16px;
`;

const STYLES_ACTIONS = css`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: ${Constants.colors.black};
`;

const STYLES_VERSION = css`
  font-family: ${Constants.font.monobold};
  font-size: 10px;
  text-transform: uppercase;
  margin-top: 8px;
`;

// TODO(jim): Delete his legacy component the moment you get a chance.
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
    const { updateAvailable } = this.props;

    let versionString = 'UNDEFINED';
    if (updateAvailable && updateAvailable.versionString) {
      versionString = updateAvailable.versionString;
    }

    let dateString = 'UNDEFINED';
    if (updateAvailable && updateAvailable.dateString) {
      dateString = updateAvailable.dateString;
    }

    return (
      <div className={STYLES_VERSION}>
        Version {versionString} // {dateString}
      </div>
    );
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
