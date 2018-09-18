import * as React from 'react';
import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  background-size: cover;
  background-position: 50% 50%;
  height: 100%;
  width: 100%;
  background: red;
`;

export default class CoreMediaScreen extends React.Component {
  render() {
    let style = { width: '100%', height: '100%' };
    if (!this.props.expanded && this.props.media && this.props.media.dimensions) {
      style = {
        width: this.props.media.dimensions.width,
        height: this.props.media.dimensions.height,
      };
    }

    return (
      <iframe
        style={style}
        allow="autoplay; camera; midi"
        frameBorder="0"
        src={this.props.media ? this.props.media.url : null}
        scrolling="no"
        allowTransparency={true}
      />
    );
  }
}
