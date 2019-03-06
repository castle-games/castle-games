import * as THREE from 'three';
import * as Constants from '~/isometric/common/constants';

export default ({ node, textures }) => {
  const material = new THREE.MeshLambertMaterial({
    color: Constants.colors.brand2,
    flatShading: true,
  });
  const geometry = new THREE.BoxGeometry(4, 15, 20);

  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = node.x * Constants.cubeSize;
  mesh.position.z = node.z * Constants.cubeSize - 12;
  mesh.position.y = node.y * Constants.cubeSize - 8;
  mesh.scale.y = 1;
  mesh.frustumCulled = false;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};
