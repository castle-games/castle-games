import * as React from 'react';
import * as Window from '~/isometric/common/window';
import * as Scene from '~/isometric/common/scene';

import GLRenderer from '~/isometric/components/GLRenderer';

const Logo = {
  id: 1,
  world: [
    [['D', 'D', 'D'], ['D', '', 'D'], ['D', 'D', 'D']],
    [['G', '', 'G'], ['', '', ''], ['G', '', 'G']],
    [['', '', ''], ['', '', ''], ['', '', 'F']],
    [['', '', ''], ['', '', ''], ['', '', 'S']],
  ],
};

const getSceneById = async (sceneId) => {
  return {
    scene: null,
  };
};

export default class GLCastle extends React.Component {
  static defaultProps = {
    size: 164,
  };

  state = {
    scene: null,
  };

  componentDidMount() {
    const { nodes, actors, measurements } = Scene.createNodes({
      world: Logo.world,
    });

    this.setState({
      scene: {
        width: this.props.size,
        height: this.props.size,
        scene: Logo.world,
        nodes,
        actors,
        measurements,
      },
    });
  }

  render() {
    const scene = this.state.scene ? (
      <GLRenderer
        battle={this.state.scene}
        style={{ maxWidth: this.props.size, height: this.props.size }}
      />
    ) : (
      <div style={{ width: this.props.size, height: this.props.size, margin: '0 auto 0 auto' }} />
    );

    return scene;
  }
}
