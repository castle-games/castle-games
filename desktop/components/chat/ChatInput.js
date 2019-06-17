import AutoSizeTextarea from 'react-textarea-autosize';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  flex-shrink: 0;
  width: 100%;
  padding: 0px 16px 8px 16px;
`;

const STYLES_INPUT = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  border: 2px solid ${Constants.REFACTOR_COLORS.elements.border};
  width: 100%;
  outline: 0;
  height: 100%;
  font-size: 14px;
  background: transparent;
  font-weight: 400;
  padding: 8px 8px 8px 8px;
  box-sizing: border-box;
  resize: none;
  border-radius: 4px;
  transition: 200ms ease border;

  ::placeholder {
    color: ${Constants.REFACTOR_COLORS.elements.servers};
  }

  :focus {
    border: 2px solid magenta;
    outline: 0;
  }
`;

export default class ChatInput extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <AutoSizeTextarea
          className={STYLES_INPUT}
          autoComplete="off"
          placeholder={this.props.placeholder}
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
        />
      </div>
    );
  }
}
