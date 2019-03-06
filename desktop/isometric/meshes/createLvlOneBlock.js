import * as THREE from 'three';
import * as Constants from '~/isometric/common/constants';

const SIDE_COLOR_1 = `#ffffff`;
const SIDE_COLOR_2 = `#c1bcbb`;
const SIDE_COLOR_3 = `#8f8b8b`;

export default ({ node, textures }) => {
  const multiMaterial = [
    // south west
    new THREE.MeshLambertMaterial({
      color: SIDE_COLOR_2,
      flatShading: true,
      wireframe: true,
    }),
    // north east
    new THREE.MeshLambertMaterial({
      color: SIDE_COLOR_1,
      flatShading: true,
      wireframe: true,
    }),
    // top
    new THREE.MeshLambertMaterial({
      color: SIDE_COLOR_3,
      flatShading: true,
      wireframe: true,
    }),
    // ??
    new THREE.MeshLambertMaterial({
      color: SIDE_COLOR_3,
      flatShading: true,
      wireframe: true,
    }),
    // side
    new THREE.MeshLambertMaterial({
      color: SIDE_COLOR_1,
      flatShading: true,
      wireframe: true,
    }),
    // side
    new THREE.MeshLambertMaterial({
      color: SIDE_COLOR_2,
      flatShading: true,
      wireframe: true,
    }),
    // ??
    new THREE.MeshLambertMaterial({
      color: SIDE_COLOR_3,
      flatShading: true,
      wireframe: true,
    }),
  ];

  const geometry = new THREE.BoxGeometry(
    Constants.cubeSize,
    Constants.cubeSize,
    Constants.cubeSize
  );

  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, multiMaterial);

  mesh.position.x = node.x * Constants.cubeSize;
  mesh.position.z = node.z * Constants.cubeSize;
  mesh.position.y = node.y * Constants.cubeSize;
  mesh.scale.y = 1;
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = false;

  return mesh;
};
