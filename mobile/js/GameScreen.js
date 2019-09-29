import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import castleMetadata from 'castle-metadata';
import url from 'url';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import GhostView from './ghost/GhostView';
import * as GhostEvents from './ghost/GhostEvents';

const DEFAULT_GAME_URI =
  'https://raw.githubusercontent.com/schazers/badboxart/master/robosquash.castle';

const castleUriToHTTPSUri = uri => uri.replace(/^castle:\/\//, 'https://');

// Fetch and return game metadata, or `null` if still fetching
const useFetchMetadata = ({ gameUri, shouldFetch }) => {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (shouldFetch) {
      (async () => {
        let newMetadata = {};
        if (gameUri.endsWith('.castle')) {
          const result = await castleMetadata.fetchMetadataForUrlAsync(
            castleUriToHTTPSUri(gameUri)
          );
          if (result.metadata) {
            newMetadata = result.metadata;
          }
        }
        if (mounted) {
          setMetadata(newMetadata);
        }
      })();
    }

    return () => (mounted = false);
  }, [gameUri, shouldFetch]);

  return metadata;
};

// Get the URI of the actual entrypoint Lua file for the game
const computeEntryPointUri = ({ gameUri, metadata }) =>
  metadata.main ? url.resolve(gameUri, metadata.main) : gameUri;

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

const LoaderText = ({ children }) => (
  <Text style={{ color: 'white', fontSize: 12 }}>{children}</Text>
);

// Given a `gameUri`, run and display the game!
const GameView = ({ gameUri }) => {
  let game = null;

  // Get game by querying `gameUri`
  const { loading: queryLoading, data } = useQuery(
    gql`
      query Game($url: String) {
        game(url: $url) {
          gameId
          entryPoint
          metadata
        }
      }
    `,
    { variables: { url: castleUriToHTTPSUri(gameUri) } }
  );
  if (!queryLoading && data && data.game) {
    game = data.game;
  }

  // If query loaded and game wasn't found, try directly fetching metadata from `gameUri`
  const fetchedMetadata = useFetchMetadata({
    gameUri,
    shouldFetch: !queryLoading && !game,
  });
  if (fetchedMetadata) {
    game = {
      gameUri,
      entryPoint: computeEntryPointUri({ gameUri, metadata: fetchedMetadata }),
      metadata: fetchedMetadata,
    };
  }

  // Maintain list of network requests Lua is making
  const [luaNetworkRequests, setLuaNetworkRequests] = useState([]);
  useEffect(() => {
    let mounted = true;

    const listener = GhostEvents.listen(
      'GHOST_NETWORK_REQUEST',
      async ({ type, id, url, method }) => {
        if (mounted) {
          if (type === 'start') {
            // Add to `luaNetworkRequests` if `url` is new
            setLuaNetworkRequests(luaNetworkRequests =>
              !luaNetworkRequests.find(req => req.url == url)
                ? [...luaNetworkRequests, { id, url, method }]
                : luaNetworkRequests
            );
          }
          if (type === 'stop') {
            // Wait for a slight bit then remove from `luaNetworkRequests`
            await new Promise(resolve => setTimeout(resolve, 60));
            if (mounted) {
              setLuaNetworkRequests(luaNetworkRequests =>
                luaNetworkRequests.filter(req => req.id !== id)
              );
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

  // Maintain whether game is actually loaded
  const [gameLoaded, setGameLoaded] = useState(false);
  useEffect(() => {
    let mounted = true;
    const listener = GhostEvents.listen('CASTLE_GAME_LOADED', () => {
      if (mounted) {
        setGameLoaded(true);
      }
    });
    return () => {
      mounted = false;
      listener.remove();
    };
  }, []);

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

      {!gameLoaded ? (
        // Render loader until `gameLoaded`
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
          {queryLoading ? (
            <LoaderText>Fetching game...</LoaderText>
          ) : luaNetworkRequests.length === 0 ? (
            <LoaderText>Starting game...</LoaderText>
          ) : (
            luaNetworkRequests.map(({ url }) => <LoaderText key={url}>Fetching {url}</LoaderText>)
          )}
        </View>
      ) : null}
    </View>
  );
};

// Navigate to a game. Can either be directly given the `game` object, or a `gameUri` to query
// to get the `game`.
export let goToGame = ({ game, gameUri }) => {};

// Top-level component which stores the `gameUri` state
const GameScreen = () => {
  const [gameUri, setGameUri] = useState(DEFAULT_GAME_URI);

  goToGame = ({ game: newGame, gameUri: newGameUri }) => {
    if (newGameUri) {
      setGameUri(newGameUri);
    }
  };

  // Use `key` to mount a new instance of `GameView` when `gameUri` changes
  return <GameView key={gameUri} gameUri={gameUri} />;
};

export default GameScreen;
