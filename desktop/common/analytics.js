/*
  This file has all of our analytics code wrapped in helper functions,
  currently it's just using amplitude to track events, but this is the place
  for other event tracking and analytics as well.
*/

let timeLastNavigated;
let lastGameLaunched;
let timeGameLaunched;
let timeWithGameInFocus;

// helper function to log amplitude events
const logAmplitudeEvent = (eventType, eventData) => {
  amplitude.getInstance().logEvent(eventType, eventData);
};

// initializes the analytics systems necessary for the tracking events below
export const initialize = () => {
  // initialize amplitude
  amplitude.getInstance().init(config.AMPLITUDE_API_KEY);
  amplitude.getInstance().setUserProperties({
    userAgent: navigator.userAgent,
  });
};

// should be called whenever the user navigates from one content mode to another
export const trackNavigation = ({ prevContentMode, nextContentMode, time = Date.now() }) => {
  // whenever we navigate away from the game, update the timer keeping track of how long it's been in focus
  if (lastGameLaunched && prevContentMode === 'game' && timeLastNavigated) {
    timeWithGameInFocus += time - timeLastNavigated;
  }
  // update the timer of when the last navigation occurred
  timeLastNavigated = time;
  // track the event in amplitude
  logAmplitudeEvent('Navigation', {
    prevContentMode,
    nextContentMode,
  });
};

// should be called whenever the user attempts to launch a game
export const trackGameLaunch = ({ game, launchSource, time = Date.now() }) => {
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
  logAmplitudeEvent('Game Launched', {
    gameId,
    gameUrl,
    gameSessionId,
    launchSource,
  });
};

// should be called whenever a game ends
export const trackGameEnd = ({ game, time = Date.now() }) => {
  const { gameId, url: gameUrl, sessionId: gameSessionId } = game;
  // figure out how long the game's been launched and in focus
  let timeSinceLaunch;
  let timeWithThisGameInFocus;
  if (lastGameLaunched && lastGameLaunched.gameId === gameId) {
    timeSinceLaunch = time - timeGameLaunched;
    timeWithThisGameInFocus = timeWithGameInFocus;
  }
  // track the event in amplitude
  logAmplitudeEvent('Game Ended', {
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
