import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import ControlledInput from '~/components/primitives/ControlledInput';

const STYLES_CONTAINER = css`
  color: ${Constants.colors.black};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 10%;
  width: 100%;
  padding: 8px;
`;

const STYLES_CONTAINER_LEFT = css`
  color: ${Constants.colors.white};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 8px;
  padding-left: 10px;
`;

const STYLES_CONTAINER_MIDDLE = css`
  min-width: 15%;
  width: 100%;
  padding-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const STYLES_DISMISS_AREA = css`
  top: 0;
  right: 0;
  position: absolute;
  width: 18px;
  height: 18px;
  margin-left: 4px;
  cursor: pointer;
`;

const STYLES_INPUT = css`
  font-family: ${Constants.font.default};
  color: ${Constants.colors.black};
  background: transparent;
  font-size: 16px;
  display: flex;
  min-width: 25%;
  width: 100%;
  border: 0;
  box-sizing: border-box;
  outline: 0;
  margin: 0;

  :focus {
    border: 0;
    outline: 0;
  }
`;

const STYLES_INPUT_READONLY = css`
  background: transparent;
  font-size: 24px;
  border-radius: 3px;
  padding: 4px 12px 4px 12px;
  cursor: default;
`;

export default class SearchInput extends React.Component {
  static defaultProps = {
    query: '',
  };

  _input;

  _handleFocusInput = () => this._input.focus();

  render() {
    let queryElement;
    if (this.props.readOnly) {
      queryElement = <p className={STYLES_INPUT_READONLY}>{this.props.query}</p>;
    } else {
      queryElement = (
        <ControlledInput
          ref={(c) => {
            this._input = c;
          }}
          className={STYLES_INPUT}
          value={this.props.query}
          name={this.props.name}
          placeholder="Search Castle or enter URL"
          onSubmit={this.props.onSubmit}
          onChange={this.props.onChange}
          style={{ paddingRight: 8 }}
        />
      );
    }
    return (
      <div className={STYLES_CONTAINER}>
        <div
          className={STYLES_CONTAINER_LEFT}
          onClick={this.props.readOnly ? this.props.onSearchReset : this._handleFocusInput}>
          <SVG.SearchBarIcon height="28px" color="#c1bcbb" />
        </div>
        <div className={STYLES_CONTAINER_MIDDLE}>
          {queryElement}
          {!Strings.isEmpty(this.props.query) ? (
            <span className={STYLES_DISMISS_AREA} onClick={this.props.onSearchReset}>
              <SVG.Dismiss width="18px" height="18px" />
            </span>
          ) : null}
        </div>
      </div>
    );
  }
}
