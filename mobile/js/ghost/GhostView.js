import React, { useState } from 'react';
import { requireNativeComponent, View } from 'react-native';

import * as GhostEvents from './GhostEvents';
import './GhostConsole';

// Implemented by 'GhostView.m' / 'GhostViewManager.java'.
const NativeGhostView = requireNativeComponent('GhostView', null);

// Apply dimensions settings by computing the actual game view size that fits in the container size
const useDimensions = ({ settings }) => {
  // Give Lua the constant dimensions
  GhostEvents.sendAsync('CASTLE_SET_DIMENSIONS', {
    width: settings.width,
    height: settings.height,
  });

  // Initialize state
  const [screenScaling, setScreenScaling] = useState(null);
  const [applyScreenScaling, setApplyScreenScaling] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  // Compute game view dimensions when container layout occurs
  const onLayoutContainer = ({
    nativeEvent: {
      layout: { width: containerWidth, height: containerHeight },
    },
  }) => {
    // Based on `ghostGetGameFrame` in 'ghost.cpp'
    if (settings.width === 0 && settings.height === 0) {
      // Full dimensions
      setApplyScreenScaling(false);
      setScreenScaling(1);
      setWidth(containerWidth);
      setHeight(containerHeight);
    } else {
      // Fixed dimensions
      setApplyScreenScaling(true);
      if (settings.width !== 0 && settings.height !== 0) {
        const newScreenScaling = Math.min(
          containerWidth / settings.width,
          containerHeight / settings.height
        );
        setScreenScaling(newScreenScaling);
        setWidth(Math.min(newScreenScaling * settings.width, containerWidth));
        setHeight(Math.min(newScreenScaling * settings.height, containerHeight));
      } else {
        if (settings.width !== 0) {
          setScreenScaling(containerWidth / settings.width);
        }
        if (settings.height !== 0) {
          setScreenScaling(containerHeight / settings.height);
        }
        setWidth(containerWidth);
        setHeight(containerHeight);
      }
    }
  };

  return { screenScaling, applyScreenScaling, width, height, onLayoutContainer };
};

const GhostView = ({ style, uri, dimensionsSettings }) => {
  const dimensionsHook = useDimensions({ settings: dimensionsSettings });

  return (
    // Letterbox the game view
    <View
      style={{
        ...style,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onLayout={dimensionsHook.onLayoutContainer}>
      {dimensionsHook.width !== null && dimensionsHook.height !== null ? (
        // Use a `View` around the actual native component since it doesn't clip properly in some cases otherwise
        <View
          style={{
            width: dimensionsHook.width,
            height: dimensionsHook.height,
          }}>
          <NativeGhostView
            style={{ width: '100%', height: '100%' }}
            uri={uri}
            screenScaling={dimensionsHook.screenScaling}
            applyScreenScaling={dimensionsHook.applyScreenScaling}
          />
        </View>
      ) : null}
    </View>
  );
};

export default GhostView;
