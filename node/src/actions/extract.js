let AdmZip = require('adm-zip');
let fs = require('fs');
let path = require('path');

/**
 *  @return {
 *    success: boolean,
 *    error: string if success === false
 *  }
 */
async function extractAsync({ zipPath, toDirectory }) {
  if (!zipPath || !fs.existsSync(zipPath)) {
    return {
      success: false,
      error: `Cannot extract: Invalid path to zip: ${zipPath}`,
    };
  }

  if (fs.existsSync(toDirectory)) {
    return {
      success: false,
      error: `Cannot extract: Target directory ${toDirectory} already exists`,
    };
  }

  // unzip will always create a new directory,
  // so we run unzip from the zip's original directory and then move the resulting child.
  let parentDirectory = path.dirname(toDirectory);
  if (!fs.existsSync(parentDirectory)) {
    await fs.mkdir(parentDirectory, (err) => {
      if (err) {
        return {
          success: false,
          error: `Cannot extract: Parent directory ${parentDirectory} does not exist and we cannot create it`,
        };
      }
    });
  }

  // unzip the files
  let zipDirectory = path.dirname(zipPath);
  const zip = new AdmZip(zipPath);
  try {
    zip.extractAllTo(zipDirectory, false);
  } catch (e) {
    return {
      success: false,
      error: `Cannot extract: Unzip failed with error: ${e}`,
    };
  }

  // `unzip` will always create a new directory named after the archive's filename
  // so we want to correct that to be the path actually specified by `toDirectory`.
  let createdDirectoryName = path.basename(zipPath, '.zip');
  let createdDirectoryPath = path.join(zipDirectory, createdDirectoryName);
  await fs.rename(createdDirectoryPath, toDirectory, (err) => {
    if (err) {
      return {
        success: false,
        error: `Unable to move project files to directory ${toDirectory}: ${err}`,
      };
    }
  });

  return { success: true };
}

module.exports = {
  name: 'extract',
  fn: extractAsync,
};
