import metadatalib from 'castle-metadata';
let yaml = require('yaml');

import * as NativeUtil from '~/native/nativeutil';

export const BLANK_TEMPLATE_ID = 'BLANK';

// TODO: correct windows paths in this method
export const rewriteCastleFileAsync = async ({
  containingFolder,
  newFilename,
  newOwner,
  newTitle,
}) => {
  let castleFilename = await NativeUtil.getProjectFilenameAtPathAsync(containingFolder);
  let existingPath = `${containingFolder}/${castleFilename}`;
  let finalMetadata = {};

  // read existing metadata
  if (castleFilename) {
    try {
      const metadataUrl = `file://${existingPath}`;
      let { metadata, info, errors, warnings } = await metadatalib.fetchMetadataForUrlAsync(
        metadataUrl,
        {
          readFileUrlAsyncFunction: NativeUtil.readFileUrl,
        }
      );
      if (errors && errors.length) {
        throw new Error(`Unable to read project file: ${errors.join(',')}`);
      }
      finalMetadata = metadata;
    } catch (e) {
      finalMetadata = {};
    }
  }

  // reconfigure
  if (newOwner) {
    finalMetadata.owner = newOwner;
  } else {
    delete finalMetadata.owner;
  }
  finalMetadata.title = newTitle;
  if (finalMetadata.description) {
    delete finalMetadata.description;
  }
  if (finalMetadata.username) {
    // legacy
    delete finalMetadata.username;
  }
  if (finalMetadata.name) {
    // legacy
    delete finalMetadata.name;
  }

  // write new project file
  const fileContents = yaml.stringify(finalMetadata);
  const outputPath = `${containingFolder}/${newFilename}`;
  await NativeUtil.writeCastleFile(outputPath, fileContents);

  // remove old project file
  if (existingPath && existingPath !== outputPath) {
    await NativeUtil.removeCastleFile(existingPath);
  }

  return false;
};
