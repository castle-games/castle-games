import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_LOG = css`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  cursor: pointer;
`;

const STYLES_DETAIL = css`
  color: ${Constants.colors.white80};
`;

const STYLES_EXPAND = css`
  font-family: ${Constants.font.default};
  color: ${Constants.colors.white};
  font-weight: 600;
  margin-top: 2px;
  font-size: 10px;
  display: flex;
  justify-content: flex-end;
  text-transform: uppercase;
`;

const UILogItem = ({ log }) => {
  const [expanded, setExpanded] = React.useState(false);
  const _onClick = () => setExpanded(!expanded);

  let maybeDetailsElement;
  if (log.details) {
    if (expanded) {
      maybeDetailsElement = <div className={STYLES_DETAIL}>{log.details}</div>;
    } else {
      maybeDetailsElement = (
        <div className={STYLES_EXPAND}>
          <span>...</span>
        </div>
      );
    }
  }
  return (
    <div className={STYLES_LOG} onClick={_onClick}>
      <div>{log.text}</div>
      {maybeDetailsElement}
    </div>
  );
}

export default UILogItem;
