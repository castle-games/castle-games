import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import ControlledInput from '~/core-components/primitives/ControlledInput';
import UIButtonSecondary from '~/core-components/reusable/UIButtonSecondary';

const STYLES_CONTAINER = css`
  @keyframes url-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: url-animation 280ms ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  width: 100%;
  background: ${Constants.colors.background};
  color: ${Constants.colors.white};
  padding: 0 16px 0 16px;
  border-bottom: 1px solid ${Constants.colors.border};
`;

const STYLES_CONTAINER_LEFT = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${Constants.colors.white};
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
  color: ${Constants.colors.white};
  display: flex;
  align-items: center;
`;

const STYLES_INPUT = css`
  background: transparent;
  font-family: ${Constants.font.default};
  color: ${Constants.colors.white};
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

const STYLES_TOAST = css`
  position: absolute;
  top: 48px;
  left: 0px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 1);
  z-index: 2;
  font-size: 12px;
  color: ${Constants.colors.black};
  background: ${Constants.colors.yellow};
`;

export default class CoreBrowseSearchInput extends React.Component {
  static defaultProps = {
    allMediaFiltered: [],
    searchQuery: '',
  };

  _input;

  _handleFocusInput = () => this._input.focus();

  render() {
    const isQualified =
      !Strings.isEmpty(this.props.searchQuery) &&
      !this.props.allMediaFiltered.length &&
      this.props.searchQuery.length > 8;
    const isRenderingToast =
      isQualified &&
      (this.props.searchQuery.endsWith('.lua') ||
        this.props.searchQuery.startsWith('castle') ||
        this.props.searchQuery.startsWith('http') ||
        this.props.searchQuery.startsWith('0.0.0.0') ||
        this.props.searchQuery.startsWith('localhost'));

    return (
      <div className={STYLES_CONTAINER}>
        <div
          className={STYLES_CONTAINER_LEFT}
          onClick={this.props.readOnly ? this.props.onSearchReset : this._handleFocusInput}>
          <SVG.SearchBarIcon height="24px" />
        </div>
        <div className={STYLES_CONTAINER_MIDDLE}>
          <ControlledInput
            ref={c => {
              this._input = c;
            }}
            className={STYLES_INPUT}
            value={this.props.searchQuery}
            name={this.props.name}
            readOnly={this.props.readOnly}
            placeholder="Search for games, media and playlists..."
            onSubmit={this.props.onSubmit}
            onChange={this.props.onChange}
          />
          {isRenderingToast ? (
            <div className={STYLES_TOAST}>
              We could not find anything that matches <b>"{this.props.searchQuery}"</b> but it looks
              like a game URL <br /> <br />
              <UIButtonSecondary onClick={() => this.props.onLoadURL(this.props.searchQuery)}>
                Open <b>{this.props.searchQuery}</b>
              </UIButtonSecondary>
            </div>
          ) : null}
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
