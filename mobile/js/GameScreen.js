import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import GhostView from './ghost/GhostView';
import * as GhostEvents from './ghost/GhostEvents';
import * as MainSwitcher from './MainSwitcher';

// Lots of APIs need regular 'https://' URIs
const castleUriToHTTPSUri = uri => uri.replace(/^castle:\/\//, 'https://');

// Populate `game` by querying the database based on `game.gameId` or `gameUri`. `game` may already be
// populated, in which case this hook doesn't fetch anything.
const useFetchGame = ({ game, gameUri }) => {
  // Set up a query to get the `game` from a '.castle' `gameUri`
  const [callQuery, { loading: queryLoading, called: queryCalled, data: queryData }] = useLazyQuery(
    gql`
      query Game($url: String) {
        game(url: $url) {
          gameId
          entryPoint
          metadata
        }
      }
    `,
    { variables: { url: gameUri && castleUriToHTTPSUri(gameUri) } }
  );

  // If `game` isn't given and `gameUri` is to a '.castle' file, query for the `game`
  if (!game && gameUri && gameUri.endsWith('.castle')) {
    if (!queryCalled) {
      callQuery();
    } else if (!queryLoading && queryData && queryData.game) {
      game = queryData.game;
    }
  }

  // If `game` isn't given and `gameUri` isn't to a '.castle' file, assume it's a direct entrypoint URI
  // and just use a stub `game`
  if (!game && gameUri && !gameUri.endsWith('.castle')) {
    game = {
      entryPoint: gameUri,
      metadata: {},
    };
  }

  return { fetchedGame: game, isFetching: queryLoading };
};

// A line of text in the loader overlay
const LoaderText = ({ children }) => (
  <Text style={{ color: 'white', fontSize: 12 }}>{children}</Text>
);

// Keep track of Lua loading state -- ongoing network requests and whether it's done
const useLuaLoading = () => {
  // Maintain list of network requests Lua is making
  const [networkRequests, setNetworkRequests] = useState([]);
  useEffect(() => {
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
  }, []);

  // Maintain whether Lua finished loading (`love.load` is done)
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
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
  }, []);

  return { networkRequests, loaded };
};

// Read dimensions settings into the `{ width, height, upscaling, downscaling }` format
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

// Given a `game` or `gameUri`, run and display the game!
const GameView = ({ game, gameUri }) => {
  // Fetch the game
  const fetchGameHook = useFetchGame({ game, gameUri });
  game = fetchGameHook.fetchedGame;

  // Keep track of whether Lua is loading
  const luaLoadingHook = useLuaLoading();

  return (
    <View style={{ flex: 1 }}>
      {game !== null ? (
        // Render `GhostView` when `game` is available
        <GhostView
          style={{ width: '100%', height: '100%' }}
          uri={game.entryPoint}
          dimensionsSettings={computeDimensionsSettings({ metadata: game.metadata })}
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
          {!game && !gameUri ? (
            // No game to run
            <LoaderText>No game</LoaderText>
          ) : fetchGameHook.isFetching ? (
            // Game is being fetched
            <LoaderText>Fetching game...</LoaderText>
          ) : luaLoadingHook.networkRequests.length === 0 ? (
            // Game is fetched, Lua isn't making network requests but `love.load` isn't finished yet
            <LoaderText>Loading game...</LoaderText>
          ) : (
            // Game is fetched, Lua is making network requests
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
  return <GameView key={(game && game.entryPoint) || gameUri} game={game} gameUri={gameUri} />;
};

export default GameScreen;
