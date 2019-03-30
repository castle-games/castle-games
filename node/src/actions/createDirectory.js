let fs = require('fs');

async function createDirectoryAsync({ path }) {
  let success = true;
  if (!fs.existsSync(path)) {
    await fs.mkdir(path, { recursive: true }, (err) => {
      if (err) success = false;
    });
  }
  return success;
}

module.exports = {
  name: 'createDirectory',
  fn: createDirectoryAsync,
};
