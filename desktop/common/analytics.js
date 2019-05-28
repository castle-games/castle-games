/*
  This file has all of our analytics code wrapped in helper functions,
  currently it's just using amplitude to track events, but this is the place
  for other event tracking and analytics as well.
*/

import * as NativeUtil from '~/native/nativeutil';

let castleVersion;
let contentMode = 'home';
let timeLastNavigated = Date.now();
let lastGameLaunched;
let timeGameLaunched;
let timeWithGameInFocus;

// helper function to log amplitude events
const logAmplitudeEvent = (eventType, eventData) => {
  amplitude.getInstance().logEvent(eventType, eventData);
};

// helper function to initialize the user with all the correct properties
const initializeUser = (user) => {
  const { userId, username, name } = user;
  // set amplitude's user id to be equal to our user id
  amplitude.getInstance().setUserId(user.userId);
  // set some properties on the user
  let properties = { userAgent: navigator.userAgent };
  if (config.TRACK_IDENTIFYING_USER_INFO) {
    properties = { ...properties, username, name };
  }
  amplitude.getInstance().setUserProperties(properties);
};

// initializes the analytics systems necessary for the tracking events below
export const initialize = async () => {
  // initialize amplitude
  amplitude.getInstance().init(config.AMPLITUDE_API_KEY);
  // figure out what version of castle we're on
  let version = await NativeUtil.getVersionAsync();
  castleVersion = typeof version === 'string' && version !== 'VERSION_UNSET' ? version : castleVersion;
  if (castleVersion) {
    amplitude.getInstance().setUserProperties({ mostRecentCastleVersion: castleVersion });
  }
};

// should be called whenever the Castle client application is launched
export const trackCastleLaunch = async () => {
  logAmplitudeEvent('Launched Castle');
};

// should be called whenever the user is logged in, either manually or automatically
export const trackLogin = async ({ user, isAutoLogin }) => {
  initializeUser(user);
  if (!isAutoLogin) {
    logAmplitudeEvent('Logged in');
  }
};

// should be called whenever the user signs up
export const trackSignUp = async ({ user }) => {
  initializeUser(user);
  logAmplitudeEvent('Signed up');
};

// should be called whenever the user navigates from one content mode to another
export const trackNavigation = async ({ prevContentMode, nextContentMode, time = Date.now() }) => {
  // whenever we navigate away from a game, update the timer keeping track of how long it's been in focus
  if (lastGameLaunched && prevContentMode === 'game') {
    timeWithGameInFocus += time - Math.max(timeLastNavigated, timeGameLaunched);
  }
  // update the timer of when the last navigation occurred
  timeLastNavigated = time;
  // track the event in amplitude (ignoring events where the user navigates to a page they're already on)
  if (contentMode !== nextContentMode || nextContentMode !== prevContentMode) {
    logAmplitudeEvent('Navigated', {
      prevContentMode,
      nextContentMode,
    });
  }
  // update the last content mode we've seen
  contentMode = nextContentMode;
};

// should be called whenever the user sends a chat message
export const trackChatMessage = async ({ message }) => {
  logAmplitudeEvent('Sent Chat Message');
};

// should be called whenever the user attempts to launch a game
export const trackGameLaunch = async ({ game, launchSource, time = Date.now() }) => {
  const { gameId, url: gameUrl, sessionId: gameSessionId } = game;
  // if a game is currently running, track the fact that it's now ending
  if (lastGameLaunched) {
    trackGameEnd({ game: lastGameLaunched });
  }
  // keep track of the last game the user launched
  lastGameLaunched = game;
  timeGameLaunched = time;
  timeWithGameInFocus = 0;
  // track the event in amplitude
  logAmplitudeEvent('Launched Game', {
    gameId,
    gameUrl,
    gameSessionId,
    launchSource,
  });
};

// should be called whenever a game ends
export const trackGameEnd = async ({ game, time = Date.now() }) => {
  const { gameId, url: gameUrl, sessionId: gameSessionId } = game;
  // figure out how long the game's been launched and in focus
  let timeSinceLaunch;
  let timeWithThisGameInFocus;
  if (lastGameLaunched && lastGameLaunched.gameId === gameId) {
    timeSinceLaunch = time - timeGameLaunched;
    timeWithThisGameInFocus = timeWithGameInFocus || 0;
    if (contentMode === 'game') {
      timeWithThisGameInFocus += time - Math.max(timeLastNavigated, timeGameLaunched);
    }
  }
  // track the event in amplitude
  logAmplitudeEvent('Ended Game', {
    gameId,
    gameUrl,
    gameSessionId,
    timeSinceLaunch,
    timeWithGameInFocus: timeWithThisGameInFocus,
  });
  // unset the game variables
  lastGameLaunched = undefined;
  timeGameLaunched = undefined;
  timeWithGameInFocus = undefined;
};
