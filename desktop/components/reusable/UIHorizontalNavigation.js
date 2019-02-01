import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_ROW = css`
  display: flex;
  padding-left: 16px;
`;

const STYLES_NAVIGATION_ITEM = css`
  background: ${Constants.colors.foreground};
  user-select: none;
  padding: 8px 16px 8px 16px;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

class UINavigationItem extends React.Component {
  render() {
    const { label, key } = this.props.item;
    return (
      <div
        className={STYLES_NAVIGATION_ITEM}
        style={{
          marginRight: 16,
          background: this.props.selected ? null : Constants.colors.background,
        }}
        onClick={() => this.props.onSelect(key)}>
        {label}
      </div>
    );
  }
}

export default class UIHorizontalNavigation extends React.Component {
  _onSelect = (key) => {
    if (this.props.onChange) {
      this.props.onChange(key);
    }
  };
  
  render() {
    const { items } = this.props;
    return (
      <div className={STYLES_ROW}>
        {items.map(item => {
          return (
            <UINavigationItem
              key={item.key}
              item={item}
              selected={item.key === this.props.selectedKey}
              onSelect={this._onSelect}
            />
          );
        })}
      </div>
    );
  }
}
