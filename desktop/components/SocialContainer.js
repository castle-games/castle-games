import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.white};
  width: 30vh;
  min-width: 280px;
`;

export default class SocialContainer extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        Its the social container
      </div>
    );
  }
}
