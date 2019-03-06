export const createKey = ({ x, z, y }) => {
  return `${x}|${z}|${y}`;
};

export const get = ({ x, z, y, nodes }) => {
  const target = nodes[`${x}|${z}|${y}`];

  return target ? target : null;
};

export const getPosition = ({ target }) => {
  const coords = target.index.split('|');
  return {
    x: coords[0],
    z: coords[1],
    y: coords[2],
  };
};

export const isPath = ({ target, nodes }) => {
  return !getAbove({ target, nodes });
};

export const getAbove = ({ target, nodes }) => {
  return get({ x: target.x, z: target.z, y: target.y + 1, nodes });
};

export const getBelow = ({ target, nodes }) => {
  return get({ x: target.x, z: target.z, y: target.y - 1, nodes });
};

export const getNorthEast = ({ target, nodes }) => {
  return get({ x: target.x, z: target.z - 1, y: target.y, nodes });
};

export const getNorthWest = ({ target, nodes }) => {
  return get({ x: target.x - 1, z: target.z, y: target.y, nodes });
};

export const getSouthEast = ({ target, nodes }) => {
  return get({ x: target.x + 1, z: target.z, y: target.y, nodes });
};

export const getSouthWest = ({ target, nodes }) => {
  return get({ x: target.x, z: target.z + 1, y: target.y, nodes });
};
