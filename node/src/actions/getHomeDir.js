let os = require('os');

module.exports = {
  name: 'getHomeDir',
  fn: os.homedir,
};
