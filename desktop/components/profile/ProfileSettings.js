import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  color: ${Constants.colors.black};
  padding: 32px;
`;

const STYLES_HEADER = css`
  color: ${Constants.colors.text};
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl5};
  margin-bottom: 16px;
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.base};
  line-height: ${Constants.linescale.base};
  margin-top: 16px;
`;

export default class ProfileSettings extends React.Component {
  render() {
    console.log(this.props);

    return (
      <div className={STYLES_CONTAINER}>
        <h2 className={STYLES_HEADER}>Notifications</h2>

        <p className={STYLES_PARAGRAPH}>Configure when you want to notified.</p>
      </div>
    );
  }
}
