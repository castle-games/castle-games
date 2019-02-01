import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import ControlledInput from '~/components/primitives/ControlledInput';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  min-width: 30%;
  width: 100%;
  padding: 0 16px 0 16px;
`;

const STYLES_CONTAINER_LEFT = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${Constants.colors.black};
  padding-right: 16px;
`;

const STYLES_CONTAINER_MIDDLE = css`
  min-width: 25%;
  width: 100%;
  padding-right: 16px;
  display: flex;
  align-items: center;
  position: relative;
`;

const STYLES_CONTAINER_RIGHT = css`
  flex-shrink: 0;
  cursor: pointer;
  color: ${Constants.colors.black};
  display: flex;
  align-items: center;
`;

const STYLES_INPUT = css`
  background: transparent;
  font-family: ${Constants.font.default};
  color: ${Constants.colors.black};
  font-size: 16px;
  min-width: 25%;
  width: 100%;
  border: 0;
  outline: 0;
  margin: 0;
  padding: 0;

  :focus {
    border: 0;
    outline: 0;
  }
`;

const STYLES_INPUT_READONLY = css`
  font-size: 16px;
  background: ${Constants.colors.foreground};
  border-radius: 3px;
  padding: 4px 12px 4px 12px;
  cursor: default;
`;

export default class CoreBrowseSearchInput extends React.Component {
  static defaultProps = {
    searchQuery: '',
  };

  _input;

  _handleFocusInput = () => this._input.focus();

  render() {
    let queryElement;
    if (this.props.readOnly) {
      queryElement = (
        <p className={STYLES_INPUT_READONLY}>
          {this.props.searchQuery}
        </p>
      );
    } else {
      queryElement = (
        <ControlledInput
          ref={c => {
            this._input = c;
          }}
          className={STYLES_INPUT}
          value={this.props.searchQuery}
          name={this.props.name}
          placeholder="Search for games and people..."
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
          <SVG.SearchBarIcon height="24px" />
        </div>
        <div className={STYLES_CONTAINER_MIDDLE}>
          {queryElement}
        </div>
        {!Strings.isEmpty(this.props.searchQuery) ? (
          <div className={STYLES_CONTAINER_RIGHT} onClick={this.props.onSearchReset}>
            <SVG.Dismiss height="16px" />
          </div>
        ) : null}
      </div>
    );
  }
}
