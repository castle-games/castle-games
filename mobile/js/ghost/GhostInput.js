import React, { useRef, useState } from 'react';
import { requireNativeComponent, View, findNodeHandle, UIManager, PixelRatio } from 'react-native';

import './GhostConsole';

export const GhostInputView = ({ zoneRef, config, style, children }) => {
  const ref = useRef(null);

  // Send our zone our layout and input props
  const sendUpdate = ({ x, y, width, height }) => {
    if (ref.current && zoneRef && zoneRef.current) {
      UIManager.dispatchViewManagerCommand(findNodeHandle(zoneRef.current), 0, [
        findNodeHandle(ref.current),
        PixelRatio.getPixelSizeForLayoutSize(x),
        PixelRatio.getPixelSizeForLayoutSize(y),
        PixelRatio.getPixelSizeForLayoutSize(width),
        PixelRatio.getPixelSizeForLayoutSize(height),
        config,
      ]);
    }
  };

  // Notify zone when layout changes
  const [layout, setLayout] = useState(null);
  const onLayout = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }) => {
    const newLayout = { x, y, width, height };
    setLayout(newLayout);
    sendUpdate(newLayout);
  };

  // Notify zone when we first receive the zone ref
  const savedZoneRef = useRef(null);
  if (zoneRef && zoneRef.current && !savedZoneRef.current) {
    savedZoneRef.current = zoneRef.current;
    if (layout) {
      sendUpdate(layout);
    }
  }

  return (
    <View ref={ref} onLayout={onLayout} style={style}>
      {children}
    </View>
  );
};

export const NativeGhostInputZone = requireNativeComponent('GhostInputZone', null);

export const GhostInputZone = ({ zoneRef, haptics, style, children }) => {
  return (
    <View style={style}>
      {children}
      <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
        <NativeGhostInputZone ref={zoneRef} haptics={haptics} style={{ flex: 1 }} />
      </View>
    </View>
  );
};
