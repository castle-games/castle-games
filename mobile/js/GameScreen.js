import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import castleMetadata from 'castle-metadata';
import url from 'url';

import GhostView from './ghost/GhostView';

// const DEFAULT_GAME_URI =
//   'https://raw.githubusercontent.com/castle-games/ghost-tests/master/screensize/project-defaults.castle';
const DEFAULT_GAME_URI =
  'https://raw.githubusercontent.com/schazers/badboxart/master/robosquash.castle';

// Fetch and return game metadata, or `null` if still fetching
const useMetadata = ({ gameUri }) => {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchMetadataAsync = async () => {
      let newMetadata = {};
      if (gameUri.endsWith('.castle')) {
        const result = await castleMetadata.fetchMetadataForUrlAsync(gameUri);
        if (result.metadata) {
          newMetadata = result.metadata;
        }
      }
      if (mounted) {
        setMetadata(newMetadata);
      }
    };
    fetchMetadataAsync();

    return () => (mounted = false);
  }, [gameUri]);

  return metadata;
};

// Get the URI of the actual entrypoint Lua file for the game
const computeEntrypointUri = ({ gameUri, metadata }) =>
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

// Given a game URI, run and display the game!
const GameScreen = ({ gameUri }) => {
  gameUri = gameUri || DEFAULT_GAME_URI;

  const metadata = useMetadata({ gameUri });

  return metadata == null ? (
    <View style={{ backgroundColor: 'black', width: '100%', height: '100%' }} />
  ) : (
    <GhostView
      style={{ width: '100%', height: '100%' }}
      uri={computeEntrypointUri({ gameUri, metadata })}
      dimensionsSettings={computeDimensionsSettings({ metadata })}
    />
  );
};

export default GameScreen;
