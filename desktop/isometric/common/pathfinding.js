import * as Constants from '~/isometric/common/constants';
import * as Detection from '~/isometric/common/detection';

export const findAdjacentPaths = ({ direction, target, nodes, height }) => {
  const paths = [];

  for (let i = 1; i < height; i++) {
    const candidate = Detection.get({
      x: target.x + Constants.directionValues[direction].x,
      z: target.z + Constants.directionValues[direction].z,
      y: target.y + i,
      nodes,
    });

    if (!candidate) {
      continue;
    }

    const nodeAbove = Detection.getAbove({ target: candidate, nodes });
    if (nodeAbove) {
      break;
    }

    if (Detection.isPath({ target: candidate, nodes })) {
      paths.push(candidate.index);
      continue;
    }
  }

  let j = 0;
  let floor;
  while (!floor && j < height) {
    floor = Detection.get({
      x: target.x + Constants.directionValues[direction].x,
      z: target.z + Constants.directionValues[direction].z,
      y: target.y - j,
      nodes,
    });

    j = j + 1;
  }

  if (floor) {
    if (Detection.isPath({ target: floor, nodes })) {
      paths.push(floor.index);
    }
  }

  return paths;
};
