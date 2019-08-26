import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  position: absolute;
  top: 40px;
  left: 0px;
  background: ${Constants.colors.white};
  border: 1px solid #f0f0f0;
  padding: 8px;
  min-width: 192px;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const STYLES_ITEM = css`
  margin: 4px 8px;
  font-size: 14px;
  color: ${Constants.colors.text};
  cursor: pointer;
`;

export default class ContentNavigationMenu extends React.Component {
  static defaultProps = {
    visible: true,
    items: [{ name: 'an item', onClick: () => {} }],
  };

  render() {
    const { items, visible } = this.props;
    if (!visible || !items || !items.length) return null;

    return (
      <div className={STYLES_CONTAINER}>
        {items.map((item, ii) => (
          <div key={`item-${ii}`} className={STYLES_ITEM} onClick={item.onClick}>
            {item.name}
          </div>
        ))}
      </div>
    );
  }
}
