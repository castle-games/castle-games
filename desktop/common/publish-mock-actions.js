import * as Actions from '~/common/actions';
import * as Browser from '~/common/browser';
import * as ExecNode from '~/common/execnode';
import * as Urls from '~/common/urls';

// need to be able to predict future slug/id/url from local castle file. also would be nice to predict future castle filehosting url (if possible?)
export const previewLocalGame = async (projectPath, existingGameId = null) => {
  let previewedGame;
  let projectFilename = await ExecNode.getProjectFilenameAtPathAsync(projectPath);
  if (!projectFilename) {
    throw new Error(
      'Unable to find a Castle project in this folder. Make sure to choose a folder that contains a .castle file.'
    );
  }

  // TODO: switch to server preview endpoint
  // and delete the following stub logic
  previewedGame = await Browser.resolveGameAtUrlAsync(`file://${projectPath}/${projectFilename}`);
  if (existingGameId) {
    previewedGame.gameId = existingGameId;
  }
  previewedGame.slug = 'TODO';
  if (!previewedGame.coverImage) {
    if (
      previewedGame.metadata &&
      previewedGame.metadata.coverImage &&
      Urls.isPrivateUrl(previewedGame.metadata.coverImage)
    ) {
      previewedGame.coverImage = {
        url: `file://${projectPath}/${previewedGame.metadata.coverImage}`,
      };
    }
  }
  return previewedGame;
};

export const uploadGame = async (projectPath) => {
  // TODO: needs to be renamed from publishProject
  let projectUrl = `file://${projectPath}`;
  let uploadedUrl = await ExecNode.publishProjectAsync(projectUrl);
  return uploadedUrl;
};

export const publishGame = async (uploadedGameUrl, existingGameId = null) => {
  // two things already exist--
  //   registerGame (needs rename)
  //   updateGameAtUrl (no longer makes sense in our new model)
  let game;
  if (existingGameId === null) {
    game = await Actions.registerGameAtUrl(uploadedGameUrl);
  } else {
    throw new Error(`Need impl for publishing to an existing game id.`);
  }
  return game;
};

export const previewGameAtUrl = async (externalUrl, existingGameId = null) => {
  let previewedGame;
  if (existingGameId === null) {
    previewedGame = await Actions.previewGameAtUrl(externalUrl);
  } else {
    throw new Error(`Need impl for previewing hosted game with an existing game id.`);
  }
  return previewedGame;
};
