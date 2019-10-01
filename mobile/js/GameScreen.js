import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import GhostView from './ghost/GhostView';
import * as GhostEvents from './ghost/GhostEvents';
import * as MainSwitcher from './MainSwitcher';
import * as LuaBridge from './LuaBridge';
import * as Session from './Session';
import * as GhostChannels from './ghost/GhostChannels';

// Required fields from the `Game` GraphQL model type for actually running a game
const GAME_REQUIRED_FIELDS = ['entryPoint', 'metadata'];
const gameHasRequiredFields = game => GAME_REQUIRED_FIELDS.every(fieldName => fieldName in game);

// Lots of APIs need regular 'https://' URIs
const castleUriToHTTPSUri = uri => uri.replace(/^castle:\/\//, 'https://');

// Populate `game` by querying the database based on `game.gameId` or `gameUri`. `game` may already be
// populated, in which case this hook doesn't fetch anything.
const useFetchGame = ({ game, gameUri }) => {
  // Set up a query to get the `game` from a '.castle' `gameUri`. We set up a 'lazy query' and then
  // only actually call it later if we decide we should.
  let shouldQuery;
  const [callQuery, { loading: queryLoading, called: queryCalled, data: queryData }] = useLazyQuery(
    gql`
      query Game($url: String, $gameId: ID) {
        game(url: $url, gameId: $gameId) {
          gameId
          ${GAME_REQUIRED_FIELDS.join(' ')}
        }
      }
    `,
    { variables: { url: gameUri && castleUriToHTTPSUri(gameUri), gameId: game && game.gameId } }
  );

  // If `game` isn't given and `gameUri` isn't to a '.castle' file, assume it's a direct entrypoint URI
  // and just use a stub `game`
  if (!game && gameUri && !gameUri.endsWith('.castle')) {
    game = {
      entryPoint: gameUri,
      metadata: {},
    };
    shouldQuery = false;
  }

  // If `game` isn't given and `gameUri` is to a '.castle' file, query for the `game`
  if (!game && gameUri && gameUri.endsWith('.castle')) {
    shouldQuery = true;
  }

  // If `game` is given but it's missing required fields, fall back to the `game === null` case and
  // re-query
  if (game && !gameHasRequiredFields(game)) {
    shouldQuery = true;
    game = null;
  }

  // If should query, query!
  if (shouldQuery) {
    if (!queryCalled) {
      callQuery();
    } else if (!queryLoading && queryData && queryData.game) {
      game = queryData.game;
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
const useInitialData = ({ game, dimensionsSettings }) => {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch `me`
  const { loading: meLoading, data: meData } = useQuery(gql`
    query Me {
      me {
        userId
        username
        name
        photo {
          url
        }
      }
    }
  `);
  const isLoggedIn = Session.isSignedIn();
  const me = isLoggedIn && !meLoading && meData && meData.me;

  useEffect(() => {
    if (!sending && game && dimensionsSettings && (!isLoggedIn || me)) {
      // Ready to send to Lua
      setSending(true);
      (async () => {
        await GhostChannels.clearAsync('INITIAL_DATA');
        await GhostChannels.pushAsync(
          'INITIAL_DATA',
          JSON.stringify({
            graphics: {
              width: dimensionsSettings.width,
              height: dimensionsSettings.height,
            },
            audio: { volume: 1 },
            user: {
              isLoggedIn,
              me: await LuaBridge.jsUserToLuaUser(me),
            },
          })
        );
        setSent(true);
      })();
    }
  }, [sending, game, dimensionsSettings]);

  return { sent };
};

// Clear Lua <-> JS events channels for a new game
const useClearEvents = () => {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await GhostEvents.clearAsync();
      if (mounted) {
        setCleared(true);
      }
    })();
    return () => (mounted = false);
  }, []);

  return { cleared };
};

// Keep track of Lua loading state -- ongoing network requests and whether it's done
const useLuaLoading = ({ ready }) => {
  // Maintain list of network requests Lua is making
  const [networkRequests, setNetworkRequests] = useState([]);
  useEffect(() => {
    if (ready) {
      let mounted = true;

      const listener = GhostEvents.listen(
        'GHOST_NETWORK_REQUEST',
        async ({ type, id, url, method }) => {
          if (mounted) {
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
              if (mounted) {
                setNetworkRequests(networkRequests => networkRequests.filter(req => req.id !== id));
              }
            }
          }
        }
      );

      return () => {
        mounted = false;
        listener.remove();
      };
    }
  }, [ready]);

  // Maintain whether Lua finished loading (`love.load` is done)
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (ready) {
      let mounted = true;
      const listener = GhostEvents.listen('CASTLE_GAME_LOADED', () => {
        if (mounted) {
          setLoaded(true);
        }
      });
      return () => {
        mounted = false;
        listener.remove();
      };
    }
  }, [ready]);

  return { networkRequests, loaded };
};

// A line of text in the loader overlay
const LoaderText = ({ children }) => (
  <Text style={{ color: 'white', fontSize: 12 }}>{children}</Text>
);

// Given a `game` or `gameUri`, run and display the game!
const GameView = ({ game, gameUri }) => {
  const fetchGameHook = useFetchGame({ game, gameUri });
  game = fetchGameHook.fetchedGame;

  const dimensionsSettings = game && computeDimensionsSettings({ metadata: game.metadata });

  const initialDataHook = useInitialData({ game, dimensionsSettings });

  const clearEventsHook = useClearEvents();

  const luaLoadingHook = useLuaLoading({ ready: clearEventsHook.cleared });

  return (
    <View style={{ flex: 1 }}>
      {game && clearEventsHook.cleared && initialDataHook.sent ? (
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

// Navigate to a game. Can either be directly given the `game` object, or a `gameUri` to query
// to get the `game`.
export let goToGame = ({ game, gameUri }) => {};

// Top-level component which stores the `game` / `gameUri` state
const GameScreen = () => {
  const [game, setGame] = useState(null);
  const [gameUri, setGameUri] = useState(null);

  goToGame = ({ game: newGame, gameUri: newGameUri, focus = true }) => {
    if (focus) {
      MainSwitcher.switchTo('game');
    }

    // Prefer `game`, then `gameUri`
    if (newGame) {
      setGame(newGame);
      setGameUri(null);
    }
    if (newGameUri) {
      setGame(null);
      setGameUri(newGameUri);
    }
  };

  // Use `key` to mount a new instance of `GameView` when the game changes
  return <GameView key={(game && game.gameId) || gameUri} game={game} gameUri={gameUri} />;
};

export default GameScreen;
