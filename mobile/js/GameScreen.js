import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import GhostView from './ghost/GhostView';
import * as GhostEvents from './ghost/GhostEvents';
import * as MainSwitcher from './MainSwitcher';
import * as LuaBridge from './LuaBridge';
import * as Session from './Session';
import * as GhostChannels from './ghost/GhostChannels';

// Lots of APIs need regular 'https://' URIs
const castleUriToHTTPSUri = uri => uri.replace(/^castle:\/\//, 'https://');

// Fetch a `Game` GraphQL entity based on `gameId` or `gameUri`
const useFetchGame = ({ gameId, gameUri }) => {
  let game = null;

  // Set up a query to get the `game` from a '.castle' `gameUri`. We set up a 'lazy query' and then
  // only actually call it if at least one of `gameId` or `gameUri` are present.
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

  // If can query, query!
  if (gameId || gameUri) {
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

  return { fetchedGame: game, fetching: queryLoading };
};

// Read dimensions settings into the `{ width, height, upscaling, downscaling }` format for `GhostView`
const computeDimensionsSettings = ({ metadata }) => {
  const { dimensions, scaling, upscaling, downscaling } = metadata;
  const dimensionsSettings = {
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
const useLuaMultiplayerClient = ({ eventsReady, game, sessionId }) => {
  GhostEvents.useListen({
    eventsReady,
    eventName: 'CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST',
    handler: async ({ mediaUrl }) => {
      if (sessionId) {
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
          const { address, sessionToken } = result.data.joinMultiplayerSession;
          GhostEvents.sendAsync('CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE', {
            address,
            sessionToken,
          });
        }
      }
    },
  });
};

// A line of text in the loader overlay
const LoaderText = ({ children }) => (
  <Text style={{ color: 'white', fontSize: 12 }}>{children}</Text>
);

// Given a `gameId` or `gameUri`, run and display the game! The lifetime of this component must match the
// lifetime of the game run -- it must be unmounted when the game is stopped and a new instance mounted
// if a new game should be run (or even if the same game should be restarted).
const GameView = ({ gameId, gameUri, extras }) => {
  const fetchGameHook = useFetchGame({ gameId, gameUri });
  const game = fetchGameHook.fetchedGame;

  const dimensionsSettings = game && computeDimensionsSettings({ metadata: game.metadata });

  const initialDataHook = useInitialData({ game, dimensionsSettings, extras });

  const clearEventsHook = GhostEvents.useClear();
  const eventsReady = clearEventsHook.cleared;

  const luaLoadingHook = useLuaLoading({ eventsReady });

  useLuaMultiplayerClient({ eventsReady, game, sessionId: extras.sessionId });

  LuaBridge.useLuaBridge({ eventsReady, game });

  return (
    <View style={{ flex: 1 }}>
      {game && eventsReady && initialDataHook.sent ? (
        // Render `GhostView` when ready
        <GhostView
          style={{ width: '100%', height: '100%' }}
          uri={game.entryPoint}
          dimensionsSettings={dimensionsSettings}
        />
      ) : null}

      {!luaLoadingHook.loaded ? (
        // Render loader overlay until Lua finishes loading
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            padding: 8,
          }}>
          {fetchGameHook.fetching ? (
            // Game is being fetched
            <LoaderText>Fetching game...</LoaderText>
          ) : !game && !gameUri ? (
            // No game to run
            <LoaderText>No game</LoaderText>
          ) : luaLoadingHook.networkRequests.length === 0 ? (
            // Game is fetched and Lua isn't making network requests, but `love.load` isn't finished yet
            <LoaderText>Loading game...</LoaderText>
          ) : (
            // Game is fetched and Lua is making network requests
            luaLoadingHook.networkRequests.map(({ url }) => (
              <LoaderText key={url}>Fetching {url}</LoaderText>
            ))
          )}
        </View>
      ) : null}
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
const GameScreen = () => {
  // Keep a single state object to make sure that re-renders happen in sync for all values
  const [state, setState] = useState({
    gameId: null,
    gameUri: null,
    extras: {},
  });

  goToGame = async ({ gameId: newGameId, gameUri: newGameUri, focus = true, extras = {} }) => {
    // Use a bit of a delay so we don't set state within `GameView` handlers
    await new Promise(resolve => setTimeout(resolve, 40));

    if (focus) {
      MainSwitcher.switchTo('game');
    }

    setState({
      gameId: newGameId ? newGameId : null,
      gameUri: newGameId ? null : newGameUri,
      extras,
    });
  };

  // Use `key` to mount a new instance of `GameView` when the game changes
  const { gameId, gameUri, extras } = state;
  return <GameView key={gameId || gameUri} gameId={gameId} gameUri={gameUri} extras={extras} />;
};

export default GameScreen;
