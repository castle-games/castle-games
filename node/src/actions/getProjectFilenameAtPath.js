let fs = require('fs');

async function getProjectFilenameAtPath({ path }) {
  let filename;
  const files = fs.readdirSync(path);
  for (let ii = 0, nn = files.length; ii < nn; ii++) {
    const file = files[ii];
    if (file.endsWith('.castle')) {
      return file;
    }
  }
  return null;
}

module.exports = {
  name: 'getProjectFilenameAtPath',
  fn: getProjectFilenameAtPath,
};
