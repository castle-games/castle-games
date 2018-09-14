import * as React from 'react';
import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  background-image: url('static/screenshot.gif');
  background-size: cover;
  background-position: 50% 50%;
  height: 100%;
  width: 100%;
`;

export default class CoreMediaScreen extends React.Component {
  render() {
    const style = this.props.expanded ? {} : { width: 992, height: 500 };

    return <div className={STYLES_CONTAINER} style={style} />;
  }
}
