import * as React from 'react';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  min-width: 54px;
  display: inline-flex;
  align-items: flex-start;
  justify-content: center;
  cursor: pointer;
  :hover {
    p {
      text-decoration: underline;
    }
  }
`;

export default class GameMetaCopyLinkControl extends React.Component {
  static defaultProps = {
    game: null,
  };

  state = {
    clicked: false,
  };

  _onClick = () => {
    let { url, sessionId } = this.props.game;
    let textField = document.createElement('textarea');
    textField.innerText = url + (sessionId ? `#${sessionId}` : '');
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    return this.setState({ clicked: true });
  };

  render() {
    const { game } = this.props;
    const { clicked } = this.state;

    if (!game) return null;

    let label, svg;
    if (clicked) {
      label = 'Copied!';
      svg = <SVG.Check size={16} style={{ marginRight: 2 }} />;
    } else {
      label = 'Copy Link';
      svg = <SVG.Link size={16} style={{ marginRight: 2 }} />;
    }

    return (
      <div
        className={STYLES_CONTAINER}
        onMouseOver={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false, clicked: false })}
        onClick={this._onClick}>
        {svg}
        <p>{label}</p>
      </div>
    );
  }
}
