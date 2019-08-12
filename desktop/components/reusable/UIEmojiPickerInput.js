import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import ControlledInput from '~/components/primitives/ControlledInput';

const STYLES_CONTAINER = css`
  margin: 0 8px 8px 8px;
  display: flex;
  border: 2px solid #ececec;
  border-radius: 4px;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-left: 4px;
  color: ${Constants.REFACTOR_COLORS.subdued};
`;

const STYLES_INPUT = css`
  box-sizing: border-box;
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  padding: 2px 4px;
  border: 0;

  :focus {
    outline: 0;
  }
`;

export default class UIEmojiPickerInput extends React.Component {
  _input;

  focus = () => this._input && this._input.focus();

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_LEFT} onClick={this.focus}>
          <SVG.SearchBarIcon height="18px" />
        </div>
        <ControlledInput ref={(c) => (this._input = c)} className={STYLES_INPUT} {...this.props} />
      </div>
    );
  }
}
