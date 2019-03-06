import * as THREE from 'three';
import { cubeSize } from '~/isometric/common/constants';

export default ({ node, textures }) => {
  const material = new THREE.MeshLambertMaterial({
    color: '#222',
    flatShading: true,
  });
  const geometry = new THREE.BoxGeometry(4, 60, 4);

  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = node.x * cubeSize;
  mesh.position.z = node.z * cubeSize;
  mesh.position.y = node.y * cubeSize;
  mesh.scale.y = 1;
  mesh.frustumCulled = false;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};
