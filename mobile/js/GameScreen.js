import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import castleMetadata from 'castle-metadata';
import url from 'url';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import GhostView from './ghost/GhostView';

// const DEFAULT_GAME_URI =
//   'https://raw.githubusercontent.com/castle-games/ghost-tests/master/screensize/project-defaults.castle';
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

// Given a `gameUri`, run and display the game!
const GameView = ({ gameUri }) => {
  let game = null;

  // Get game by querying `gameUri`
  const { loading: queryLoading, error, data } = useQuery(
    gql`
      query($url: String) {
        game(url: $url) {
          title
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

  return game === null ? (
    <View style={{ backgroundColor: 'black', width: '100%', height: '100%' }} />
  ) : (
    <GhostView
      style={{ width: '100%', height: '100%' }}
      uri={game.entryPoint}
      dimensionsSettings={computeDimensionsSettings({ metadata: game.metadata })}
    />
  );
};

// Screen-level component which reads navigation parameters
const GameScreen = ({ gameUri }) => {
  // Prefer prop, then navigation param, then default URI
  gameUri = gameUri || useNavigationParam('gameUri') || DEFAULT_GAME_URI;

  // Use `key` to mount a new instance of `GameView` when `gameUri` changes
  return <GameView key={gameUri} gameUri={gameUri} />;
};

export default GameScreen;
