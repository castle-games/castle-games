import * as Constants from '~/isometric/common/constants';
import * as Detection from '~/isometric/common/detection';
import * as PathFinding from '~/isometric/common/pathfinding';
import * as Strings from '~/isometric/common/strings';

export const connectNode = ({ target, nodes, height }) => {
  target.paths = {};

  Constants.directionChoices.forEach(direction => {
    target.paths[direction] = PathFinding.findAdjacentPaths({
      direction,
      target,
      nodes,
      height,
    });
  });

  return target;
};

export const createNodes = ({ world }) => {
  const nodes = {};
  const actors = {};
  const height = world.length;

  let width = 0;
  let length = 0;
  world.forEach(row => {
    width = Math.max(width, row.length);
    row.forEach(column => {
      length = Math.max(length, column.length);
    });
  });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < length; z++) {
        const symbol = world[y][x][z];

        if (Strings.isEmptyOrNull(symbol)) {
          continue;
        }

        const target = {
          x: x - Math.floor(width * 0.5),
          z: z - Math.floor(length * 0.5),
          y: y - height * 0.5,
          level: y * 2,
          symbol,
        };

        target.index = Detection.createKey({
          x: target.x,
          z: target.z,
          y: target.y,
        });

        nodes[target.index] = target;
      }
    }
  }

  Object.keys(nodes).forEach(name => {
    nodes[name] = connectNode({ target: nodes[name], nodes, height });
  });

  return { nodes, actors, measurements: { height, length, width } };
};
