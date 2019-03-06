import * as THREE from 'three';

const texturesList = [
/*
  {
    id: 1,
    name: 'redBlock',
    type: 'terrain',
    texture: 'static/textures/red-block.png',
  },
  {
    id: 2,
    name: 'purpleBlockTwo',
    type: 'terrain',
    texture: 'static/textures/purple-block-2.png',
  },
*/
];

export const load = () => {
  const textureLoader = new THREE.TextureLoader();
  const textures = {};

  if (!texturesList.length) {
    return new Promise(resolve => resolve());
  }

  return new Promise(resolve => {
    let loaded = 0;
    texturesList.map(each => {
      const { name, type, texture } = each;
      if (!textures[type]) {
        textures[type] = {};
      }

      textureLoader.load(texture, resource => {
        textures[type][name] = resource;
        loaded = loaded + 1;

        if (loaded === texturesList.length) {
          return resolve(textures);
        }
      });
    });
  });
};
