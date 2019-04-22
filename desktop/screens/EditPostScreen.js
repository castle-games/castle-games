import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';

import UIButton from '~/components/reusable/UIButton';
import UIHeading from '~/components/reusable/UIHeading';
import ControlledInput from '~/components/primitives/ControlledInput';
import Logs from '~/common/logs';

const STYLES_CONTAINER = css`
  flex: 1
  background: ${Constants.colors.background};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 24px;
  align-items: center;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_SIZER = css`
  max-width: 600px;
`;

const STYLES_INPUT_CONTAINER = css`
  border: 1px solid ${Constants.colors.background4};
  background-color: ${Constants.colors.background};
  border-radius: 4px;
  margin-bottom: 16px;
`;

const STYLES_INPUT = css`
  background: ${Constants.colors.white};
  color: ${Constants.colors.black};
  display: block;
  box-sizing: border-box;
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  border: 2px solid transparent;
  font-size: 16px;
  margin: 0 0 0 0;

  :focus {
    outline: 0;
    border: 2px solid transparent;
  }
`;

const STYLES_MEDIA_CONTAINER = css`
  background-color: ${Constants.colors.white};
  padding: 4px 8px 4px 8px;
`;

const STYLES_MEDIA_IMAGE = css`
  background-color: ${Constants.colors.black};
  object-fit: contain;
  width: 100%;
  max-height: 500px;
`;

const STYLES_ACTIONS = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const STYLES_BACK = css`
  display: inline-flex;
  height: 48px;
  align-items: center;
  justify-content: center;
  text-decoration: underline;
  font-size: ${Constants.typescale.lvl6};
  color: ${Constants.colors.text};
  cursor: pointer;
`;

class EditPostScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    const { message, mediaPath } = props.editPost;

    this.state = {
      message,
      mediaPath,
    };
  }

  _handleChangeMessage = (e) => {
    this.setState({
      message: e.target.value,
    });
  };

  _isValidForSubmit = () => {
    return (
      (typeof this.state.message === 'string' && this.state.message.length > 0) ||
      this.state.mediaPath
    );
  };

  _handleCancel = () => {
    this.props.onCancel && this.props.onCancel();
    this.props.navigateToCurrentGame && this.props.navigateToCurrentGame();
  };

  _handleSubmit = () => {
    if (this._isValidForSubmit()) {
      if (this.props.onSubmit) {
        const { message, mediaPath } = this.state;
        this.props.onSubmit({
          message,
          mediaPath,
        });
      }
      this.props.navigateToCurrentGame && this.props.navigateToCurrentGame();
    }
  };

  _alreadySelectedInputOnce = false;
  _maybeSelectInput = (ref) => {
    if (ref && !this._alreadySelectedInputOnce) {
      ref._input.select();
      this._alreadySelectedInputOnce = true;
    }
  };

  render() {
    let maybeMediaContainer;
    if (this.state.mediaPath) {
      maybeMediaContainer = (
        <div className={STYLES_MEDIA_CONTAINER}>
          <img className={STYLES_MEDIA_IMAGE} src={this.state.mediaPath} />
        </div>
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SIZER}>
          <UIHeading>Make a post</UIHeading>
          <div className={STYLES_INPUT_CONTAINER}>
            <ControlledInput
              ref={this._maybeSelectInput}
              autoFocus
              onChange={this._handleChangeMessage}
              onFocus={this._handleFocus}
              onBlur={this._handleBlur}
              placeholder="Say something!"
              value={this.state.message}
              className={STYLES_INPUT}
            />
            {maybeMediaContainer}
          </div>
          <div className={STYLES_ACTIONS}>
            <div className={STYLES_BACK} onClick={this._handleCancel}>
              Cancel
            </div>
            <UIButton disabled={!this._isValidForSubmit()} onClick={this._handleSubmit}>
              Submit
            </UIButton>
          </div>
        </div>
      </div>
    );
  }
}

export default class EditPostScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <NavigationContext.Consumer>
            {(navigation) => {
              const { editPost, onSubmit, onCancel } = navigation.params;
              return (
                <EditPostScreen
                  {...this.props}
                  editPost={editPost}
                  onSubmit={onSubmit}
                  onCancel={onCancel}
                  navigateToCurrentGame={navigator.navigateToCurrentGame}
                />
              );
            }}
          </NavigationContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
