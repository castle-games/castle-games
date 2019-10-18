import React from 'react';
import { requireNativeComponent, View } from 'react-native';

import './GhostConsole';

const ENABLE_INPUTS = true;

// Implemented by 'GhostInputView.m' / 'GhostInputViewManager.java'.
const NativeGhostInputView = requireNativeComponent('GhostInputView', null);

const GhostInputView = ({ input, style, children }) => {
  if (!ENABLE_INPUTS) {
    return null;
  }

  return (
    <View style={style}>
      {children}
      <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
        <NativeGhostInputView style={{ flex: 1 }} input={input} />
      </View>
    </View>
  );
};

export default GhostInputView;
