import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_ROW = css`
  display: flex;
  padding-left: 8px;
`;

const STYLES_NAVIGATION_ITEM = css`
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.base};
  user-select: none;
  padding: 16px;
  cursor: pointer;
`;

const UINavigationItem = (props) => {
  const { label, key } = props.item;
  return (
    <div
      className={STYLES_NAVIGATION_ITEM}
      style={{
        marginRight: 16,
        color: props.selected ? Constants.colors.text : Constants.colors.text2,
      }}
      onClick={props.onSelect}>
      {label}
    </div>
  );
};

const UIHorizontalNavigation = (props) => (
  <div className={STYLES_ROW} style={props.style}>
    {props.items.map((item) => {
      return (
        <UINavigationItem
          key={item.key}
          item={item}
          selected={item.key === props.selectedKey}
          onSelect={() => { props.onChange && props.onChange(item.key) }}
        />
      );
    })}
  </div>
);

export default UIHorizontalNavigation;
