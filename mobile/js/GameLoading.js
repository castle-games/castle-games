import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import * as Constants from './Constants';

// A line of text in the loader overlay
const LoaderText = ({ children }) => (
  <Text style={{ color: 'white', fontSize: 12 }}>{children}</Text>
);

const GameLoading = ({ noGame, fetching, luaNetworkRequests, extras }) => (
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
    {!extras.seed ? (
      // If game is 'embedded', don't show a loading indicator and hope it loads quickly
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    ) : null}
    {false && Constants.iOS ? null : fetching ? (
      // Game is being fetched
      <LoaderText>Fetching game...</LoaderText>
    ) : noGame ? (
      // No game to run
      <LoaderText>No game</LoaderText>
    ) : luaNetworkRequests.length === 0 ? (
      // Game is fetched and Lua isn't making network requests, but `love.load` isn't finished yet
      <LoaderText>Loading game...</LoaderText>
    ) : (
      // Game is fetched and Lua is making network requests
      luaNetworkRequests.map(({ url }) => <LoaderText key={url}>Fetching {url}</LoaderText>)
    )}
  </View>
);

export default GameLoading;
