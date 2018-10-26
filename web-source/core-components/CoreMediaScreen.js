import * as React from 'react';
import { css } from 'react-emotion';

export default class CoreMediaScreen extends React.Component {
  render() {
    let style = { width: '100%', height: '100%' };
    if (!this.props.isExpanded && this.props.media && this.props.media.dimensions) {
      style = {
        width: this.props.media.dimensions.width,
        height: this.props.media.dimensions.height,
      };
    }

    if (!this.props.isVisible) {
      style = { width: '1px', height: '1px', position: 'absolute', top: 0, left: 0, opacity: 0 };
    }

    return (
      <iframe
        style={{ ...style, background: `#000000` }}
        allow="autoplay; camera; midi"
        frameBorder="0"
        src={this.props.media.mediaUrl}
        scrolling="yes"
      />
    );
  }
}
