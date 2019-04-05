import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import ControlledInput from '~/components/primitives/ControlledInput';
import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 10%;
  width: 100%;
  padding: 13px;
  color: black;
  background: white;
  border-radius:50px;
`;

const STYLES_CONTAINER_LEFT = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${Constants.colors.white};
  padding-right: 8px;
`;

const STYLES_CONTAINER_MIDDLE = css`
  min-width: 25%;
  width: 100%;
  padding-right: 10px;
  display: flex;
  align-items: center;
  position: relative;
`;

const STYLES_INPUT = css`
  background: transparent;
  font-family: ${Constants.font.default};
  color: ${Constants.colors.black};
  font-size: 20px;
  min-width: 25%;
  width: 94%;
  border: 0;
  outline: 0;
  margin: 0;
  padding: 0 0 2px 0;

  :focus {
    border: 0;
    outline: 0;
  }
`;

const STYLES_INPUT_READONLY = css`
  font-size: 24px;
  background: ${Constants.colors.background3};
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
          placeholder="Search Castle or Enter URL"
          onSubmit={this.props.onSubmit}
          onChange={this.props.onChange}
        />
      );
    }
    return (
      <div className={STYLES_CONTAINER}>
        <div
          className={STYLES_CONTAINER_LEFT}
          onClick={this.props.readOnly ? this.props.onSearchReset : this._handleFocusInput}>
          <SVG.SearchBarIcon height="32px" color="#c1bcbb" />
        </div>
        <div className={STYLES_CONTAINER_MIDDLE}>{queryElement}</div>
        {!Strings.isEmpty(this.props.query) ? (
          <SVG.Dismiss
            onClick={this.props.onSearchReset}
            style={{ cursor: 'pointer', position: 'absolute', right: '20px' }}
            height="24px"
          />
        ) : null}
      </div>
    );
  }
}
