import * as THREE from 'three';
import * as React from 'react';

import { css } from 'react-emotion';

import GLComponent from '~/isometric/classes/gl-component';
import AnimationLoop from '~/isometric/classes/animation-loop';

const STYLES_GL_RENDERER = css`
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  display: block;
  margin: 0 auto 0 auto;
  animation: fade-in 200ms ease;
`;

export default class GLRenderer extends React.Component {
  _GLComponent = undefined;
  _AnimationLoop = undefined;

  async componentDidMount() {
    this._GLComponent = new GLComponent({
      width: this.props.battle.width,
      height: this.props.battle.height,
      container: this.refs.canvas,
      measurements: this.props.battle.measurements,
      nodes: this.props.battle.nodes,
    });

    this._AnimationLoop = new AnimationLoop();

    await this._GLComponent.mount();
    this._GLComponent.firstRender();
    this._AnimationLoop.subscribe(() => {
      this._GLComponent.render();
      this._GLComponent.panCamera();
    });
    this._AnimationLoop.start();
  }

  componentWillUnmount() {
    this.reset();
  }

  pause() {
    this._AnimationLoop.stop();
  }

  resume() {
    if (!this._GLComponent) {
      return null;
    }

    this._AnimationLoop.start();
  }

  reset() {
    this._AnimationLoop.stop();
    this._AnimationLoop.unsubscribeAll();
    this._AnimationLoop = null;
    this._GLComponent.unmount();
    this._GLComponent = null;
  }

  render() {
    return <div className={STYLES_GL_RENDERER} ref="canvas" style={this.props.style} />;
  }
}
