import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_LINK = css`
  color: ${Constants.colors.action};
  text-decoration: underline;
  opacity: 1;
  font-weight: 600;
  cursor: pointer;
`;

export default (props) => {
  return (
    <span
      href={props.href}
      target={props.target}
      onClick={props.onClick}
      children={props.children}
      className={STYLES_LINK}
    />
  );
};
