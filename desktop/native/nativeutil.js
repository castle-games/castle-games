import fileUriToPath from 'file-uri-to-path';

import Logs from '~/common/logs';
import { NativeBinds } from '~/native/nativebinds';

export const installUpdate = async () => {
  await NativeBinds.installUpdate();
};

export const getDocumentsPathAsync = async () => {
  let directory;
  try {
    directory = await NativeBinds.getDocumentsPath();
  } catch (e) {
    return null;
  }
  return directory;
};

export const getVersionAsync = async () => {
  let version;
  try {
    version = await NativeBinds.getVersion();
  } catch (e) {
    return null;
  }
  return version;
};

export const chooseDirectoryWithDialogAsync = async ({ title, message, action }) => {
  let chosenDirectory;
  try {
    chosenDirectory = await NativeBinds.chooseDirectoryWithDialog({ title, message, action });
  } catch (e) {
    return null;
  }
  return chosenDirectory;
};

export const chooseOpenProjectPathWithDialogAsync = async () => {
  let chosenDirectory;
  try {
    chosenDirectory = await NativeBinds.chooseOpenProjectPathWithDialog();
  } catch (e) {
    return null;
  }
  return chosenDirectory;
};

export const chooseImagePathWithDialogAsync = async () => {
  let chosenImagePath;
  try {
    chosenImagePath = await NativeBinds.chooseImagePathWithDialog();
  } catch (e) {
    return null;
  }
  return chosenImagePath;
};

export const createProjectAtPathAsync = async (path) => NativeBinds.createProjectAtPath({ path });

export const setBrowserReady = async (callback) => {
  await NativeBinds.browserReady();
  if (callback) {
    return callback();
  }
};

export const openExternalURL = async (externalUrl) => {
  await NativeBinds.openExternalUrl({ url: externalUrl });
};

export const setWindowFrameFullscreen = async (isFullscreen) => {
  await NativeBinds.setWindowFrameFullscreen({ isFullscreen });
};

export const getWindowFrameFullscreen = async () => {
  return (await NativeBinds.getWindowFrameFullscreen({})) === 'true';
};

export const sendLuaEvent = async (name, params) => {
  await NativeBinds.sendLuaEvent({ jsonified: JSON.stringify({ name, params }) });
};

export const readFile = async (filepath) => {
  let result = await NativeBinds.readFile({ filepath });
  return result;
};

export const writeCastleFile = async (filepath, contents) => {
  let result = await NativeBinds.writeCastleFile({ filepath, contents });
  return result;
};

export const removeCastleFile = async (filepath) => {
  let result = await NativeBinds.removeCastleFile({ filepath });
  return result;
};

export const readFileUrl = async (fileUrl) => {
  let filepath;
  try {
    filepath = fileUriToPath(fileUrl);
  } catch (e) {
    console.warn(`something bad happened`);
    return '';
  }
  let result = await NativeBinds.readFile({ filepath });
  return result;
};

export const focusGame = async () => {
  return await NativeBinds.focusGame();
};

export const setCpuMonitoring = async (isMonitoring) => {
  return await NativeBinds.setCpuMonitoring({ isMonitoring });
};

export const getMicrophonePermission = async () => {
  return await NativeBinds.getMicrophonePermission();
};
