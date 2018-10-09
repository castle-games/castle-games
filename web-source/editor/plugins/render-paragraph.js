import * as React from 'react';

import { css } from 'react-emotion';

const STYLES_PARAGRAPH = css`
  font-size: 16px;
  font-weight: 300;
  line-height: 1.5;
`;

export default () => {
  return {
    renderNode(props) {
      const { attributes, children, node, className, style } = props;
      switch (node.type) {
        default:
          return (
            <p
              className={STYLES_PARAGRAPH}
              {...attributes}
              className={className}
              children={children}
            />
          );
      }
    },
  };
};
