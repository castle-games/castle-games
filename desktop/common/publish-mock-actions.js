import * as Actions from '~/common/actions';
import * as Browser from '~/common/browser';
import * as ExecNode from '~/common/execnode';
import * as Urls from '~/common/urls';

// need to be able to predict future slug/id/url from local castle file. also would be nice to predict future castle filehosting url (if possible?)
export const previewLocalGame = async (projectPath, existingGameId = null) => null;

export const uploadGame = async (projectPath) => {
  // TODO: needs to be renamed from publishProject
  /* let projectUrl = `file://${projectPath}`;
  let uploadedUrl = await ExecNode.publishProjectAsync(projectUrl);
  return uploadedUrl; */
  return `https://api.castle.games/api/hosted/@benpublish/cool-published-game/cool-published-game.castle`;
};

export const publishGame = async (uploadedGameUrl, existingGameId = null) => {
  // two things already exist--
  //   registerGame (needs rename)
  //   updateGameAtUrl (no longer makes sense in our new model)
  /* let game;
  if (existingGameId === null) {
    game = await Actions.registerGameAtUrl(uploadedGameUrl);
  } else {
    throw new Error(`Need impl for publishing to an existing game id.`);
  }
  return game; */

  return {
    gameId: '48',
    title: 'Cool Published Game',
    url: 'https://castle.games/@benpublish/cool-published-game',
    slug: '@benpublish/cool-published-game',
    createdTime: '2019-04-18T23:15:15.342Z',
    updatedTime: '2019-04-25T16:00:58.837Z',
    description: null,
    metadata: {
      main: 'main.lua',
    },
    entryPoint: 'https://api.castle.games/api/hosted/@benpublish/cool-published-game/main.lua',
    serverEntryPoint:
      'https://api.castle.games/api/hosted/@benpublish/cool-published-game/main.lua',
    sessionId: null,
    playCount: 1,
    coverImage: null,
    storageId: '9a4f6eb4-9f0d-4d13-86ac-cfba4f3fad00',
  };
};

export const previewGameAtUrl = async (externalUrl, existingGameId = null) => null;
