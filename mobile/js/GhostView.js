// Implemented by 'GhostView.m'.

import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

export default (Platform.OS !== 'android' ? requireNativeComponent('GhostView', null) : () => null);
