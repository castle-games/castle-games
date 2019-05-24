const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFileAsync = util.promisify(fs.writeFile);

async function writeCastleIdFile({ projectDirectory, gameId }) {
  const filename = path.join(projectDirectory, '.castleid');
  try {
    await writeFileAsync(filename, `id: ${gameId}\n`);
  } catch (e) {
    throw new Error(`Cannot write castle id file: ${e.message}`);
  }
  return true;
}

module.exports = {
  name: 'writeCastleIdFile',
  fn: writeCastleIdFile,
};
