import metadatalib from 'castle-metadata';
let yaml = require('yaml');

import * as ExecNode from '~/common/execnode';
import * as NativeUtil from '~/native/nativeutil';
import * as Utilities from '~/common/utilities';

const path = Utilities.path();

export const BLANK_TEMPLATE_ID = 'BLANK';

export const getDefaultUserProjectsPathAsync = async () => {
  let nativeResult = await NativeUtil.getDocumentsPathAsync();
  if (nativeResult) {
    // if we have this, it's more accurate
    return nativeResult;
  }
  return ExecNode.getHomeDirAsync();
};

export const rewriteCastleFileAsync = async ({
  containingFolder,
  newFilename,
  newOwner,
  newTitle,
}) => {
  let castleFilename = await ExecNode.getProjectFilenameAtPathAsync(containingFolder);
  if (!castleFilename) {
    throw new Error(
      `Can't configure project at ${containingFolder}: No project file found at this path`
    );
  }
  let existingPath = path.join(containingFolder, castleFilename);
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
  const outputPath = path.join(containingFolder, newFilename);
  await NativeUtil.writeCastleFile(outputPath, fileContents);

  // remove old project file
  if (existingPath && existingPath !== outputPath) {
    await NativeUtil.removeCastleFile(existingPath);
  }

  return false;
};
