import { NativeBinds } from '~/native/nativebinds';
import * as Constants from '~/common/constants';
import * as Actions from '~/common/actions';

export const extractAsync = async (zipPath, toDirectory) =>
  execNodeAsync('extract', { zipPath, toDirectory });

export const getHomeDirAsync = async () => execNodeAsync('getHomeDir', {});

export const getProjectFilenameAtPathAsync = async (path) =>
  execNodeAsync('getProjectFilenameAtPath', { path });

let publishPreviousHashes = {};

export async function publishProjectAsync(dir) {
  try {
    let token = await Actions.getAccessTokenAsync();
    let result = await execNodeAsync('publishProject', {
      dir,
      apiHost: Constants.API_HOST,
      token,
      previousHashes: publishPreviousHashes,
    });

    for (let i = 0; i < result.hashes.length; i++) {
      publishPreviousHashes[result.hashes[i]] = true;
    }

    return result.devUrl;
  } catch (e) {
    throw new Error(`failed to publish: ${e}`);
  }
}

export async function execNodeAsync(action, args) {
  let result = await NativeBinds.execNode({
    input: btoa(
      JSON.stringify({
        action,
        args,
      })
    ),
  });

  try {
    return JSON.parse(result);
  } catch (e) {
    throw new Error(`Error parsing as JSON: ${result}`);
  }
}
