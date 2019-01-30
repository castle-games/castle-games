import metadatalib from 'castle-metadata';

import * as Actions from '~/common/actions';
import * as NativeUtil from '~/native/nativeutil';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';

function _validateMetadata(metadata, isRegistered) {
  if (!metadata) {
    throw new Error(`Metadata is invalid: ${metadata}`);
  }
  let validatedMetadata = { ...metadata };
  const registeredFields = [ 'gameId', 'user', 'slug' ];
  if (isRegistered) {
    registeredFields.forEach(field => {
      if (!validatedMetadata.hasOwnProperty(field)) {
        throw new Error(`Registered game is missing field: ${field}`);
      }
    });
  } else {
    // unregistered games can't have any of these
    registeredFields.forEach(field => {
      if (validatedMetadata.hasOwnProperty(field)) {
        delete validatedMetadata[field];
      }
    });
  }
  return validatedMetadata;
};

async function _resolveMetadataAtUrlAsync(metadataUrl) {
  try {
    let {
      metadata,
      info,
      errors,
      warnings
    } = await metadatalib.fetchMetadataForUrlAsync(metadataUrl, {
      readFileUrlAsyncFunction: NativeUtil.readFileUrl,
    });
    if (errors && errors.length) {
      throw new Error(`Error fetching metadata: ${errors.join(',')}`);
    }
    metadata = _validateMetadata(metadata, false);
    return { metadata, info };
  } catch (e) {
    throw new Error(`Couldn't resolve metadata at .castle url: ${e.message}`);
  }
  return null;
}

async function _readGameFromMetadataUrlAsync(url) {
  let game = { url };
  const { metadata } = await _resolveMetadataAtUrlAsync(url);
  if (metadata) {
    game.metadata = metadata;
    if (metadata.name) game.name = metadata.name;
    if (metadata.description) game.description = metadata.description;
    if (metadata.username) game.username = metadata.username;
  }
  return game;
}

async function resolveGameAtUrlAsync(gameUrl) {
  let game;

  // always try to resolve from the server first
  try {
    game = await Actions.getGameByUrl(gameUrl);
    game.metadata = _validateMetadata(game.metadata, !Strings.isEmpty(game.gameId));
  } catch (e) {
    game = null;
  }

  // if the server failed, try to read the .castle file directly
  if (!game && Urls.isMetadataFileUrl(gameUrl)) {
    try {
      game = await _readGameFromMetadataUrlAsync(gameUrl);
    } catch (e) {
      game = null;
    }
  }

  if (!game) {
    // if nothing worked, assume this is a direct url to some code with no metadata
    game = {
      url: gameUrl,
    }
  };

  return game;
}

export {
  resolveGameAtUrlAsync,
};
