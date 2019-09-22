import React, { useState } from 'react';
import { requireNativeComponent, View } from 'react-native';

// Implemented by 'GhostView.m' / 'GhostViewManager.java'.
const NativeGhostView = requireNativeComponent('GhostView', null);

// Compute actual game view dimensions according to https://castle.games/posts/@castle/game-dimensions-and-scaling
// when container layout occurs
const useDimensions = ({ settings }) => {
  const [screenScaling, setScreenScaling] = useState(null);
  const [applyScreenScaling, setApplyScreenScaling] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const onContainerLayout = ({
    nativeEvent: {
      layout: { width: containerWidth, height: containerHeight },
    },
  }) => {
    // Based on `ghostGetGameFrame` in 'ghost.cpp'
    if (settings.width == 0 && settings.height == 0) {
      // Full dimensions
      setApplyScreenScaling(false);
      setScreenScaling(1);
      setWidth('100%');
      setHeight('100%');
    } else {
      // Fixed dimensions
      setApplyScreenScaling(true);
      let newScreenScaling;
      if (containerWidth < settings.width || containerHeight < settings.height) {
        // Down
        if (settings.downscaling == 'off') {
          newScreenScaling = 1;
        } else if (settings.downscaling == 'on') {
          newScreenScaling = Math.min(
            containerWidth / settings.width,
            containerHeight / settings.height
          );
        } else if (settings.downscaling == 'step') {
          const scale = Math.min(
            containerWidth / settings.width,
            containerHeight / settings.height
          );
          newScreenScaling = 1;
          while (newScreenScaling > 0.125 && newScreenScaling > scale) {
            newScreenScaling *= 0.5;
          }
        }
      } else {
        // Up
        if (settings.upscaling == 'off') {
          newScreenScaling = 1;
        } else if (settings.upscaling == 'on') {
          newScreenScaling = Math.min(
            containerWidth / settings.width,
            containerHeight / settings.height
          );
        } else if (settings.upscaling == 'step') {
          newScreenScaling = Math.floor(
            Math.min(containerWidth / settings.width, containerHeight / settings.height)
          );
        }
      }
      setScreenScaling(newScreenScaling);
      setWidth(Math.min(newScreenScaling * settings.width, containerWidth));
      setHeight(Math.min(newScreenScaling * settings.height, containerHeight));
    }
  };

  return { screenScaling, applyScreenScaling, width, height, onContainerLayout };
};

const GhostView = ({ style, uri }) => {
  const dimensionsHook = useDimensions({
    settings: {
      width: 800,
      height: 450,
      upscaling: 'on',
      downscaling: 'on',
    },
  });

  return (
    <View
      style={{
        ...style,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onLayout={dimensionsHook.onContainerLayout}>
      {dimensionsHook.width !== null && dimensionsHook.height !== null ? (
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
