import * as THREE from 'three';
import * as Meshes from '~/isometric/meshes';
import * as Textures from '~/isometric/common/textures';
import * as NodeUtils from '~/isometric/common/node-utils';
import * as Constants from '~/isometric/common/constants';

import OrbitControls from '~/isometric/common/orbit';

export default class GLComponent {
  _getViewportMeasurements = () => {
    const viewSize = this.state.height;
    const aspectRatio = this.state.width / this.state.height;

    return {
      viewSize: viewSize,
      aspectRatio: aspectRatio,
      left: (-aspectRatio * viewSize) / 2,
      right: (aspectRatio * viewSize) / 2,
      top: viewSize / 2,
      bottom: viewSize / -2,
      near: -2048,
      far: 2048,
    };
  };

  constructor(props) {
    this.state = {
      width: undefined,
      height: undefined,
      nodes: undefined,
      scene: undefined,
      renderer: undefined,
      container: undefined,
      camera: undefined,
      measurements: undefined,
      controls: undefined,
      ...props,
    };
  }

  setState(newProps) {
    this.state = { ...this.state, ...newProps };
  }

  unmount() {
    this.state.width = null;
    this.state.height = null;
    this.state.nodes = null;
    this.state.scene = null;
    this.state.renderer = null;
    this.state.container = null;
    this.state.camera = null;
    this.state.measurements = null;
    this.state.controls = null;
    this.render = () => {
      console.log('Error: If this is getting called, that is bad.');
    };
  }

  async mount() {
    this.state.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.state.renderer.shadowMap.enabled = false;
    this.state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.state.renderer.physicallyBasedShading = true;
    this.state.renderer.setClearColor(0x000000, 0);
    this.state.renderer.setPixelRatio(window.devicePixelRatio);
    this.state.renderer.setSize(this.state.width - 0, this.state.height - 4);
    this.state.scene = new THREE.Scene();
    this.state.container.appendChild(this.state.renderer.domElement);
    this.state.textures = await Textures.load();

    const viewport = this._getViewportMeasurements();

    this.state.camera = new THREE.OrthographicCamera(
      viewport.left,
      viewport.right,
      viewport.top,
      viewport.bottom,
      viewport.near,
      viewport.far
    );
    this.state.camera.position.x = 0.2;
    this.state.camera.position.y = 0.1;
    this.state.camera.position.z = 0.2;
    this.state.camera.zoom = 1.4;

    this.state.controls = new OrbitControls(this.state.camera, this.state.renderer.domElement);

    /*
    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.5);

    shadowLight.position.set(200, 600, 200);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -600;
    shadowLight.shadow.camera.right = 600;
    shadowLight.shadow.camera.top = 600;
    shadowLight.shadow.camera.bottom = -600;
    shadowLight.shadow.camera.near = viewport.near;
    shadowLight.shadow.camera.far = viewport.far;
    shadowLight.shadow.mapSize.width = viewport.far;
    shadowLight.shadow.mapSize.height = viewport.far;

    this.state.scene.add(shadowLight);
    */

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.9);

    this.state.scene.add(hemisphereLight);

    /*
    const ambientLight = new THREE.AmbientLight(0x888888, 0.7);

    this.state.scene.add(ambientLight);
    */
  }

  firstRender() {
    Object.keys(this.state.nodes).forEach((key) => {
      const mesh = NodeUtils.getMeshFromSymbol({
        node: this.state.nodes[key],
        textures: this.state.textures,
      });

      if (mesh) {
        this.state.scene.add(mesh);
      }
    });

    this.state.renderer.render(this.state.scene, this.state.camera);
  }

  panCamera() {
    this.state.scene.rotation.y += (-90 * Math.PI) / 4320;
  }

  render() {
    this.state.renderer.render(this.state.scene, this.state.camera);
  }
}
