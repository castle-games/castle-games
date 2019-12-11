import React, { useState, useEffect, useRef, Fragment } from 'react';
import { View, KeyboardAvoidingView, PixelRatio } from 'react-native';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import castleMetadata from 'castle-metadata';
import url from 'url';
import ip from 'ip';
import ActionSheet from 'react-native-action-sheet';

import GhostView from './ghost/GhostView';
import * as GhostEvents from './ghost/GhostEvents';
import * as MainSwitcher from './MainSwitcher';
import * as LuaBridge from './LuaBridge';
import * as Session from './Session';
import * as GhostChannels from './ghost/GhostChannels';
import Tools from './Tools';
import GameInputs, { NUM_GAME_INPUTS_MODES, GAME_INPUTS_ACTION_KEY_CODES } from './GameInputs';
import GameHeader from './GameHeader';
import GameLoading from './GameLoading';
import * as Constants from './Constants';
import GameLogs from './GameLogs';

// Whether the given URI is local
const isLocalUri = uri => {
  const parsed = url.parse(uri);
  return parsed.hostname && (parsed.hostname == 'localhost' || !ip.isPublic(parsed.hostname));
};

// Fetch a `Game` GraphQL entity based on `gameId` or `gameUri`. Uses the seeded game data from `extras` if
// present, in case the game is 'embedded'.
const useFetchGame = ({ gameId, gameUri, extras }) => {
  const [game, setGame] = useState(null);

  const httpsUri = gameUri && gameUri.replace(/^castle:\/\//, 'https://');

  // Direct metadata fetcher for when `gameUri` is a LAN URI.
  const [fetchMetadata, setFetchMetadata] = useState(null);
  const callFetchMetadata = useRef(null);
  const [fetchCalled, setFetchCalled] = useState(false);
  useEffect(() => {
    cancelled = false;

    callFetchMetadata.current = async httpUri => {
      let newMetadata = {};
      if (httpUri.endsWith('.castle')) {
        const result = await castleMetadata.fetchMetadataForUrlAsync(httpUri);
        if (result.metadata) {
          newMetadata = result.metadata;
        }
      }
      if (!cancelled) {
        setFetchMetadata(newMetadata);
      }
    };

    return () => (cancelled = true);
  }, []);

  // GraphQL query for when we're using `gameId`, or if `gameUri` is a public URI.
  const [callQuery, { loading: queryLoading, called: queryCalled, data: queryData }] = useLazyQuery(
    gql`
      query Game($gameId: ID, $gameUri: String) {
        game(gameId: $gameId, url: $gameUri) {
          gameId
          entryPoint
          metadata
          storageId
          ...LuaGame
        }
      }
      ${LuaBridge.LUA_GAME_FRAGMENT}
    `,
    {
      variables: {
        gameId,
        gameUri: httpsUri,
      },
    }
  );

  // If we don't have `game` yet, we'll need to fetch it. We're ready to do that once either
  // `gameId` or `gameUri` are given. Also if we have 'seeded' data in `extras`, we use that directly.
  if (!game && (gameId || gameUri)) {
    if (extras && extras.seed) {
      setGame(extras.seed);
    } else if (gameUri && isLocalUri(gameUri)) {
      // LAN URI -- use a direct fetch
      const httpUri = gameUri.replace(/^castle:\/\//, 'http://');
      if (!fetchCalled && callFetchMetadata.current) {
        setFetchCalled(true);
        callFetchMetadata.current(httpUri);
      } else if (fetchMetadata) {
        // LAN URI will always be an unregistered game without a `gameId`
        setGame({
          isLocal: true,
          url: httpUri,
          entryPoint: fetchMetadata.main ? url.resolve(httpUri, fetchMetadata.main) : httpUri,
          metadata: fetchMetadata,
        });
      }
    } else {
      // Public URI -- use the GraphQL query
      if (!queryCalled) {
        callQuery();
      } else if (!queryLoading) {
        if (queryData && queryData.game) {
          // Query was successful!
          setGame(queryData.game);
        } else if (gameUri) {
          // Query wasn't successful, assume this is a direct entrypoint URI and use an unregistered `game`
          // without a `gameId`
          setGame({
            url: httpsUri,
            entryPoint: httpsUri,
            metadata: {},
          });
        }
      }
    }
  }

  return { fetchedGame: game, fetching: (fetchCalled && !fetchMetadata) || queryLoading };
};

// Read dimensions settings into the `{ width, height, upscaling, downscaling }` format for `GhostView`
const computeDimensionsSettings = ({ metadata }) => {
  const { dimensions, scaling, upscaling, downscaling } = metadata;

  let dimensionsSettings = {
    width: 800,
    height: 450,
    upscaling: 'on',
    downscaling: 'on',
  };
  if (dimensions) {
    if (dimensions === 'full') {
      dimensionsSettings.width = 0;
      dimensionsSettings.height = 0;
    } else {
      if (typeof dimensions === 'string') {
        const xIndex = dimensions.indexOf('x');
        if (xIndex > 1) {
          // WxH
          const [widthStr, heightStr] = dimensions.split('x');
          dimensionsSettings.width = parseInt(widthStr) || 800;
          dimensionsSettings.height = parseInt(heightStr) || 450;
        } else if (xIndex == 0) {
          // xH
          dimensionsSettings.width = 0;
          dimensionsSettings.height = parseInt(dimensions.slice(1));
        } else if (xIndex == -1) {
          // W
          dimensionsSettings.width = parseInt(dimensions);
          dimensionsSettings.height = 0;
        }
      } else if (typeof dimensions === 'number') {
        dimensionsSettings.width = dimensions;
        dimensionsSettings.height = 0;
      }
    }
  }
  if (scaling) {
    dimensionsSettings.upscaling = scaling;
    dimensionsSettings.downscaling = scaling;
  }
  if (upscaling) {
    dimensionsSettings.upscaling = upscaling;
  }
  if (downscaling) {
    dimensionsSettings.downscaling = downscaling;
  }

  // Mobile overrides...
  dimensionsSettings.upscaling = 'on';
  dimensionsSettings.downscaling = 'on';

  return dimensionsSettings;
};

// Populate the 'INITIAL_DATA' channel that Lua reads for various initial settings (eg. the user
// object, initial audio volume, initial post, ...)
const useInitialData = ({ game, dimensionsSettings, extras }) => {
  const [sent, setSent] = useState(false);
  const sending = useRef(false);

  // Fetch `me`
  const isLoggedIn = Session.isSignedIn();
  const [callMe, { loading: meLoading, called: meCalled, data: meData }] = useLazyQuery(gql`
    query Me {
      me {
        ...LuaUser
      }
    }
    ${LuaBridge.LUA_USER_FRAGMENT}
  `);
  if (isLoggedIn && !meCalled) {
    callMe();
  }
  const me = isLoggedIn && !meLoading && meData && meData.me;

  useEffect(() => {
    if (!sending.current && game && dimensionsSettings && (!isLoggedIn || me)) {
      // Ready to send to Lua
      sending.current = true;
      (async () => {
        // Clear the channel just in case
        await GhostChannels.clearAsync('INITIAL_DATA');

        // Prepare the data
        const initialData = {
          graphics: {
            width: dimensionsSettings.width,
            height: dimensionsSettings.height,
          },
          audio: { volume: 1 },
          user: {
            isLoggedIn,
            me: await LuaBridge.jsUserToLuaUser(me),
          },
          game: await LuaBridge.jsGameToLuaGame(game),
          hostedFiles: game.hostedFiles,
          referrerGame: extras.referrerGame
            ? await LuaBridge.jsGameToLuaGame(extras.referrerGame)
            : undefined,
          initialParams: extras.initialParams ? extras.initialParams : undefined,
          // TODO(nikki): Add `initialPost`...
        };

        // Send it!
        await GhostChannels.pushAsync('INITIAL_DATA', JSON.stringify(initialData));
        setSent(true);
      })();
    }
  }, [game, dimensionsSettings, isLoggedIn, me]);

  return { sent };
};

// Keep track of Lua loading state
const useLuaLoading = ({ eventsReady }) => {
  // Maintain list of network requests Lua is making
  const [networkRequests, setNetworkRequests] = useState([]);
  GhostEvents.useListen({
    eventsReady,
    eventName: 'GHOST_NETWORK_REQUEST',
    handler: async ({ type, id, url, method }) => {
      if (type === 'start') {
        // Add to `networkRequests` if `url` is new
        setNetworkRequests(networkRequests =>
          !networkRequests.find(req => req.url == url)
            ? [...networkRequests, { id, url, method }]
            : networkRequests
        );
      }
      if (type === 'stop') {
        // Wait for a slight bit then remove from `networkRequests`
        await new Promise(resolve => setTimeout(resolve, 60));
        setNetworkRequests(networkRequests => networkRequests.filter(req => req.id !== id));
      }
    },
  });

  // Maintain whether Lua finished loading (`love.load` is done)
  const [loaded, setLoaded] = useState(false);
  GhostEvents.useListen({
    eventsReady,
    eventName: 'CASTLE_GAME_LOADED',
    handler: () => setLoaded(true),
  });

  return { networkRequests, loaded };
};

// Connect the game to the multiplayer session we're supposed to be in when it asks
const useLuaMultiplayerClient = ({ eventsReady, game, sessionId, setSessionId }) => {
  GhostEvents.useListen({
    eventsReady,
    eventName: 'CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST',
    handler: async ({ mediaUrl }) => {
      let connectionParams;
      if (game.gameId) {
        // Registered game
        connectionParams = {
          gameId: game.gameId,
          castleFileUrl: game.url,
          entryPoint: null,
          sessionId,
          isStaging: false,
        };
      } else {
        // Unregistered game, just use `entryPoint`
        connectionParams = {
          gameId: null,
          castleFileUrl: null,
          entryPoint: mediaUrl,
          sessionId,
          isStaging: false,
        };
      }
      const result = await Session.apolloClient.mutate({
        mutation: gql`
          mutation ConnectMultiplayerClient(
            $gameId: ID
            $castleFileUrl: String
            $entryPoint: String
            $sessionId: String
            $isStaging: Boolean
          ) {
            joinMultiplayerSession(
              gameId: $gameId
              castleFileUrl: $castleFileUrl
              entryPoint: $entryPoint
              sessionId: $sessionId
              isStaging: $isStaging
            ) {
              sessionId
              address
              isNewSession
              sessionToken
            }
          }
        `,
        variables: connectionParams,
      });
      if (result.data) {
        const {
          address,
          sessionId,
          isNewSession,
          sessionToken,
        } = result.data.joinMultiplayerSession;
        GhostEvents.sendAsync('CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE', {
          address,
          sessionToken,
        });
        if (isNewSession) {
          setSessionId(sessionId);
        }
      }
    },
  });
};

// Send user status messages while the game is being played
const useUserStatus = ({ game }) => {
  useEffect(() => {
    if (game) {
      let mounted = true;
      let interval;

      const stop = () => {
        mounted = false;
        clearInterval(interval);
      };

      const recordUserStatus = async isNewSession => {
        if (mounted) {
          const title = game.title || game.metadata.title || game.name || game.metadata.name;
          const status = game.isLocal ? 'make' : 'play';

          let result;
          if (game.gameId) {
            // Registered game
            result = await Session.apolloClient.mutate({
              mutation: gql`
                mutation($status: String!, $isNewSession: Boolean, $registeredGameId: ID!) {
                  recordUserStatus(
                    status: $status
                    isNewSession: $isNewSession
                    registeredGameId: $registeredGameId
                  ) {
                    userStatusId
                  }
                }
              `,
              variables: { status, isNewSession, registeredGameId: game.gameId },
            });
          } else {
            // Unregistered game
            let coverImageUrl;
            if (game.coverImage && game.coverImage.url) {
              coverImageUrl = game.coverImage.url;
            } else if (game.metadata && game.metadata.coverImage) {
              let resolvedUrl = url.resolve(game.url, game.metadata.coverImage);
              if (!isLocalUri(resolvedUrl)) {
                coverImageUrl = resolvedUrl;
              }
            } else if (game.metadata && game.metadata.coverImageUrl) {
              if (!isLocalUri(game.metadata.coverImageUrl)) {
                coverImageUrl = game.metadata.coverImageUrl; // `coverImageUrl` is deprecated
              }
            }
            result = await Session.apolloClient.mutate({
              mutation: gql`
                mutation(
                  $status: String!
                  $url: String!
                  $title: String
                  $coverImage: String
                  $isNewSession: Boolean
                ) {
                  recordUserStatus(
                    status: $status
                    isNewSession: $isNewSession
                    unregisteredGame: { url: $url, title: $title, coverImage: $coverImage }
                  ) {
                    userStatusId
                  }
                }
              `,
              variables: {
                status,
                isNewSession,
                url: game.url,
                title,
                coverImage: coverImageUrl,
              },
            });
          }
          if (result.errors && result.errors.length) {
            if (result.errors[0].extensions.code === 'LOGIN_REQUIRED') {
              stop();
            }
          }
        }
      };

      // Do it once as a new session, then every 25 seconds not as a new session
      recordUserStatus(true);
      interval = setInterval(() => recordUserStatus(false), 25000);

      return stop;
    }
  }, [game]);
};

// Given a `gameId` or `gameUri`, run and display the game! The lifetime of this component must match the
// lifetime of the game run -- it must be unmounted when the game is stopped and a new instance mounted
// if a new game should be run (or even if the same game should be restarted).
const GameView = ({
  gameId,
  gameUri,
  extras,
  windowed,
  onPressReload,
  logsVisible,
  setLogsVisible,
}) => {
  const fetchGameHook = useFetchGame({ gameId, gameUri, extras });
  const game = fetchGameHook.fetchedGame;

  useUserStatus({ game });

  const dimensionsSettings = game && computeDimensionsSettings({ metadata: game.metadata });

  const initialDataHook = useInitialData({ game, dimensionsSettings, extras });

  const clearEventsHook = GhostEvents.useClear();
  const eventsReady = clearEventsHook.cleared;

  const luaLoadingHook = useLuaLoading({ eventsReady });

  const [sessionId, setSessionId] = useState(extras.sessionId);

  useLuaMultiplayerClient({ eventsReady, game, sessionId, setSessionId });

  LuaBridge.useLuaBridge({ eventsReady, game });

  const [inputsMode, setInputsMode] = useState(
    extras.inputsMode !== undefined ? extras.inputsMode : 0
  );
  const onPressNextInputsMode = () => {
    setInputsMode((inputsMode + 1) % NUM_GAME_INPUTS_MODES);
  };

  const [actionKeyCode, setActionKeyCode] = useState(
    extras.actionKeyCode !== undefined ? extras.actionKeyCode : GAME_INPUTS_ACTION_KEY_CODES[0]
  );
  const onPressSwitchActionKeyCode = () => {
    ActionSheet.showActionSheetWithOptions({ options: GAME_INPUTS_ACTION_KEY_CODES }, i => {
      if (typeof i === 'number') {
        setActionKeyCode(GAME_INPUTS_ACTION_KEY_CODES[i]);
      }
    });
  };

  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
  const keyboardAvoidingContainerRef = useRef(null);
  const updateKeyboardAvoidingVerticalOffset = () => {
    if (keyboardAvoidingContainerRef.current) {
      keyboardAvoidingContainerRef.current.measureInWindow((x, y) => setKeyboardVerticalOffset(y));
    }
  };

  const [landscape, setLandscape] = useState(false);

  const onPressToggleLogsVisible = () => {
    setLogsVisible(!logsVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      {!windowed && (
        <GameHeader
          game={game}
          sessionId={sessionId}
          onPressReload={onPressReload}
          onPressNextInputsMode={onPressNextInputsMode}
          onPressSwitchActionKeyCode={onPressSwitchActionKeyCode}
          onPressToggleLogsVisible={onPressToggleLogsVisible}
        />
      )}

      <View
        style={{ flex: 1 }}
        ref={ref => {
          keyboardAvoidingContainerRef.current = ref;
          updateKeyboardAvoidingVerticalOffset();
        }}
        onLayout={({
          nativeEvent: {
            layout: { width, height },
          },
        }) => {
          updateKeyboardAvoidingVerticalOffset();
          setLandscape(width > height);
        }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          enabled={Constants.iOS}
          keyboardVerticalOffset={keyboardVerticalOffset}>
          {game && eventsReady && initialDataHook.sent ? (
            <Tools eventsReady={eventsReady} visible={!windowed} landscape={landscape} game={game}>
              <GhostView
                style={{ flex: 1 }}
                uri={game.entryPoint}
                dimensionsSettings={dimensionsSettings}
              />
              <GameInputs
                visible={!windowed}
                inputsMode={inputsMode}
                actionKeyCode={actionKeyCode}
              />
            </Tools>
          ) : null}
          {!luaLoadingHook.loaded ? (
            <GameLoading
              noGame={!game && !gameUri}
              fetching={fetchGameHook.fetching}
              luaNetworkRequests={luaLoadingHook.networkRequests}
              extras={extras}
            />
          ) : null}
          <GameLogs eventsReady={eventsReady} visible={!windowed && logsVisible} />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

// Navigate to a game given its `gameId` or `gameUri`. `focus` is whether to shift focus to the game view.
//
// `extras` carries extra parameters to the game:
//   `referrerGame`: Game that navigated to this game through `castle.game.load`, if any
//   `initialParams`: `params` parameter passed to `castle.game.load` while navigating to this game, if any
//   `sessionId`: Session ID for the multiplayer session, if any
//
// This function is actually set below when `GameScreen` is mounted.
export let goToGame = ({ gameId, gameUri, focus, extras }) => {};

// Top-level component which stores the `gameId` or  `gameUri` state. This component is mounted for the
// entire lifetime of the app and mounts fresh `GameView` instances for each game run.
const GameScreen = ({ windowed = false }) => {
  // Keep a single state object to make sure that re-renders happen in sync for all values
  const [state, setState] = useState({
    gameId: null,
    gameUri: null,
    reloadCount: 0,
    extras: {},
  });

  goToGame = async ({ gameId: newGameId, gameUri: newGameUri, focus = true, extras = {} }) => {
    // Use a bit of a delay so we don't set state within `GameView` handlers
    await new Promise(resolve => setTimeout(resolve, 40));

    if (newGameId || newGameUri) {
      MainSwitcher.setGameRunning(true);
      if (focus) {
        MainSwitcher.switchTo('game');
      }
    } else {
      MainSwitcher.switchTo('navigator');
      MainSwitcher.setGameRunning(false);
    }

    setState({
      ...state,
      gameId: newGameId ? newGameId : null,
      gameUri: newGameId ? null : newGameUri,
      extras,
    });
  };

  const onPressReload = async () => {
    // Use a bit of a delay so we don't set state within `GameView` handlers
    await new Promise(resolve => setTimeout(resolve, 40));

    setState({
      ...state,
      reloadCount: state.reloadCount + 1,
    });
  };

  const [logsVisible, setLogsVisible] = useState(false);

  // Use `key` to mount a new instance of `GameView` when the game changes
  const { gameId, gameUri, reloadCount, extras } = state;
  return (
    <GameView
      key={`$${reloadCount}-${gameId || gameUri}`}
      gameId={gameId}
      gameUri={gameUri}
      extras={extras}
      windowed={windowed}
      onPressReload={onPressReload}
      logsVisible={logsVisible}
      setLogsVisible={setLogsVisible}
    />
  );
};

export default GameScreen;
