import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import UIButton from '~/components/reusable/UIButton';

const STYLES_CONTAINER = css`
  padding: 16px;
  background: ${Constants.brand.yellow};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const STYLES_UPDATE_DETAILS = css`
  color: ${Constants.colors.text2};
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.linescale.lvl7};
  margin-top: 4px;
`;

const STYLES_ACTIONS = css`
  display: flex;
  align-items: center;
`;

const STYLES_ACTION_CANCEL = css`
  padding: 8px 16px 8px 16px;
  text-decoration: underline;
  text-transform: uppercase;
  cursor: pointer;
`;

export default class HomeUpdateBanner extends React.Component {
  static defaultProps = {
    updateAvailable: {},
    onNativeUpdateInstall: (shouldInstall) => {},
  };

  _renderDetails = () => {
    let detailsElement;
    const { versionString, dateString } = this.props.updateAvailable;
    if (versionString && dateString) {
      return (
        <div className={STYLES_UPDATE_DETAILS}>
          Version {versionString}, {dateString}
        </div>
      );
    }
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div>
          <div>A new version of Castle is available!</div>
          {this._renderDetails()}
        </div>
        <div className={STYLES_ACTIONS}>
          <UIButton onClick={() => this.props.onNativeUpdateInstall(true)}>Update Castle</UIButton>
          <div
            className={STYLES_ACTION_CANCEL}
            onClick={() => this.props.onNativeUpdateInstall(false)}>
            Later
          </div>
        </div>
      </div>
    );
  }
}
