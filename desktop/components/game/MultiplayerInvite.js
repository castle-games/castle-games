import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css, keyframes } from 'react-emotion';

const HIGHLIGHT_GREEN = '#54d41f';

const STYLES_CONTAINER = css`
  display: inline-flex;
  align-items: center;
  font-family: ${Constants.REFACTOR_FONTS.system};
  flex-shrink: 0;
  user-select: none;
  font-size: ${Constants.typescale.lvl6};
  line-height: ${Constants.linescale.lvl5};
  letter-spacing: 0.1px;
  font-weight: 600;
  padding: 0 4px 0 4px;
`;

const STYLES_SESSION_CONTAINER = css`
  background-color: ${Constants.colors.black};
  color: ${Constants.colors.white};
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin: 0 0 0 8px;
`;

const STYLES_SESSION_LINK = css`
  background-color: transparent;
  color: ${Constants.colors.white};
  width: 200px;
  font-family: ${Constants.font.mono};
  height: 24px;
  padding: 5px 0 2px 4px;
  font-size: 0.65rem;
  font-weight: 600;
  border: none;
  margin: 0 0 0 6px;
  outline: none;
`;

const STYLES_COPY_TO_CLIPBOARD = css`
  display: flex;
  cursor: pointer;
  margin: 0 6px 0 6px;
  padding: 6px 4px 6px 4px;
`;

const KEYFRAMES_HIGHLIGHT = keyframes`
  0% {
    background-color: ${HIGHLIGHT_GREEN};
  }
  100% {
    background-color: ${Constants.colors.black};
  }
`;

const STYLES_HIGHLIGHTED = css`
  animation: ${KEYFRAMES_HIGHLIGHT} 1s ease 1;
`;

export default class MultiplayerInvite extends React.Component {
  static defaultProps = {
    sessionLink: 'https://castle.games/+a12ng2/@bridgs/brickball#jR4ge8VYB',
    shortSessionLink: '@bridgs/brickball#jR4ge8VYB',
    style: null,
  };

  state = {
    highlighted: false,
  };

  _sessionContainer;

  _highlight = () => {
    this.setState({ highlighted: true });
  };

  _unhighlight = () => {
    this.setState({ highlighted: false });
  };

  _handleCopySessionLink = (e) => {
    let textField = document.createElement('textarea');
    textField.innerText = this.props.sessionLink;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    this._highlight();
  };

  render() {
    let sessionContainerClass = this.state.highlighted
      ? `${STYLES_SESSION_CONTAINER} ${STYLES_HIGHLIGHTED}`
      : STYLES_SESSION_CONTAINER;
    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <span>Invite:</span>
        <div
          className={sessionContainerClass}
          ref={(r) => (this._sessionContainer = r)}
          onAnimationEnd={this._unhighlight}>
          <input
            className={STYLES_SESSION_LINK}
            contentEditable={false}
            readOnly={true}
            value={this.props.shortSessionLink}
            onCopy={this._handleCopySessionLink}
            onCut={this._handleCopySessionLink}
          />
          <div className={STYLES_COPY_TO_CLIPBOARD} onClick={this._handleCopySessionLink}>
            {this.state.highlighted ? <SVG.Check size="18px" /> : <SVG.Link size="18px" />}
          </div>
        </div>
      </div>
    );
  }
}
