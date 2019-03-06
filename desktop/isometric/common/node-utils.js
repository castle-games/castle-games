import * as Meshes from '~/isometric/meshes';

export const getMeshFromSymbol = ({ node, textures }) => {
  let mesh;

  if (node.symbol === 'D') {
    return Meshes.createLvlOneBlock({ node, textures });
  }

  if (node.symbol === 'G') {
    return Meshes.createLvlOneBlock({ node, textures });
  }

  if (node.symbol === 'F') {
    return Meshes.createFlagPost({ node, textures });
  }

  if (node.symbol === 'S') {
    return Meshes.createFlagPostFlag({ node, textures });
  }

  return mesh;
};
