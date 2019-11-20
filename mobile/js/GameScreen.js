import React, { useState, useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, Keyboard } from 'react-native';
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

// Lots of APIs need regular 'https://' URIs
const castleUriToHTTPSUri = uri => uri.replace(/^castle:\/\//, 'https://');

// Fetch a `Game` GraphQL entity based on `gameId` or `gameUri`
const useFetchGame = ({ gameId, gameUri }) => {
  let game = null;

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
        gameUri: gameUri && castleUriToHTTPSUri(gameUri),
      },
    }
  );

  // If neither `gameId` nor `gameUri` are given, no game is being played, so don't do anything
  if (gameId || gameUri) {
    // Figure out whether it's a LAN URI
    let isLAN = false;
    if (gameUri) {
      const parsed = url.parse(gameUri);
      if (parsed.hostname && (parsed.hostname == 'localhost' || !ip.isPublic(parsed.hostname))) {
        isLAN = true;
      }
    }

    if (isLAN) {
      // LAN URI -- use a direct fetch
      const httpUri = gameUri.replace(/^castle:\/\//, 'http://');
      if (!fetchCalled && callFetchMetadata.current) {
        setFetchCalled(true);
        callFetchMetadata.current(httpUri);
      } else if (fetchMetadata) {
        // LAN URI will always be an unregistered game without a `gameId`
        game = {
          entryPoint: fetchMetadata.main ? url.resolve(httpUri, fetchMetadata.main) : httpUri,
          metadata: fetchMetadata,
        };
      }
    } else {
      // Public URI -- use the GraphQL query
      if (!queryCalled) {
        callQuery();
      } else if (!queryLoading) {
        if (queryData && queryData.game) {
          // Query was successful!
          game = queryData.game;
        } else if (gameUri) {
          // Query wasn't successful, assume this is a direct entrypoint URI and use an unregistered `game`
          // without a `gameId`
          game = {
            entryPoint: gameUri,
            metadata: {},
          };
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
      const [widthStr, heightStr] = dimensions.split('x');
      dimensionsSettings.width = parseInt(widthStr) || 800;
      dimensionsSettings.height = parseInt(heightStr) || 450;
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
  const { loading: meLoading, data: meData } = useQuery(gql`
    query Me {
      me {
        ...LuaUser
      }
    }
    ${LuaBridge.LUA_USER_FRAGMENT}
  `);
  const isLoggedIn = Session.isSignedIn();
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

// Given a `gameId` or `gameUri`, run and display the game! The lifetime of this component must match the
// lifetime of the game run -- it must be unmounted when the game is stopped and a new instance mounted
// if a new game should be run (or even if the same game should be restarted).
const GameView = ({ gameId, gameUri, extras, windowed, onPressReload }) => {
  const fetchGameHook = useFetchGame({ gameId, gameUri });
  const game = fetchGameHook.fetchedGame;

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
    ActionSheet.showActionSheetWithOptions(
      {
        options: GAME_INPUTS_ACTION_KEY_CODES,
      },
      i => {
        if (typeof i === 'number') {
          setActionKeyCode(GAME_INPUTS_ACTION_KEY_CODES[i]);
        }
      }
    );
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
        />
      )}

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {game && eventsReady && initialDataHook.sent ? (
          // Render `GhostView` and `GameInputs` when ready
          <View style={{ flex: 1 }}>
            <GhostView
              style={{ flex: 1 }}
              uri={game.entryPoint}
              dimensionsSettings={dimensionsSettings}
            />
            <GameInputs visible={!windowed} inputsMode={inputsMode} actionKeyCode={actionKeyCode} />
          </View>
        ) : null}
        <Tools eventsReady={eventsReady} />

        {!luaLoadingHook.loaded ? (
          <GameLoading
            noGame={!game && !gameUri}
            fetching={fetchGameHook.fetching}
            luaNetworkRequests={luaLoadingHook.networkRequests}
          />
        ) : null}
      </KeyboardAvoidingView>
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
    />
  );
};

export default GameScreen;
