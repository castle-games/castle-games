module.exports = require('./Storage.web');
if (process && process.versions && process.versions.node) {
  module.exports = eval("require('./storage/FileSystemStorage')");
}
