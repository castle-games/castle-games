import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  position: absolute;
  top: 40px;
  left: 0px;
  background: ${Constants.colors.white};
  border: 1px solid #f0f0f0;
  min-width: 192px;
  display: flex;
  flex-direction: column;
  z-index: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
`;

const STYLES_ITEM = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 200;
  padding: 6px 8px;
  font-size: 14px;
  color: ${Constants.colors.text};
  cursor: pointer;
  overflow-wrap: break-word;
  line-height: 18px;
  background: transparent;

  :hover {
    background: #e5e5e5;
  }

  span {
    display: inline-block;
    vertical-align: top;
  }
`;

const STYLES_SEPARATOR = css`
  height: 1px;
  background: #e9e9e9;
  margin: 2px 0;
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
        {items.map((item, ii) => {
          if (item.isSeparator) {
            return <div key={`item-${ii}`} className={STYLES_SEPARATOR} />;
          } else {
            return (
              <div key={`item-${ii}`} className={STYLES_ITEM} onClick={item.onClick}>
                {item.name}
              </div>
            );
          }
        })}
      </div>
    );
  }
}
