import React, { useState, Fragment } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, Clipboard } from 'react-native';
import FastImage from 'react-native-fast-image';

import { RootNavigator } from './Navigation';
import GameScreen from './GameScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

export let switchTo = () => {};

export let setGameRunning = () => {};

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  windowed: {
    position: 'absolute',
    bottom: 64,
    left: 16,
    zIndex: 1,
    backgroundColor: '#000',
    width: 135,
    height: 240,
    borderRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  logItem: {
    fontFamily: 'monospace',
    lineHeight: 16,
    fontSize: 12,
    color: '#fff',
  },
  logItemError: {
    color: '#f00',
  },
  logItemSystem: {
    color: '#f0f',
  },
});

const FAKELOG = [
  {
    type: 'PRINT',
    body: '/! Attempt to assign inexistant controller 0 to player 0.',
  },
  {
    type: 'PRINT',
    body: 'Initiating shutdown.',
  },
  {
    type: 'PRINT',
    body: 'GFX system shut down.',
  },
  {
    type: 'PRINT',
    body: 'Input system shut down.',
  },
  {
    type: 'PRINT',
    body: 'Audio system shut down.',
  },
  {
    type: 'PRINT',
    body: 'Application ran for 61.265467524994 seconds.',
  },
  {
    type: 'PRINT',
    body: 'All systems shut down.',
  },
  {
    type: 'SYSTEM',
    body:
      'Loading game entry point: https://raw.githubusercontent.com/revillo/castle-games/master/gemzen.lua',
  },
  {
    type: 'PRINT',
    body: '449ms GET https://api.github.com/repos/revillo/castle-games/git/refs/heads/master',
  },
  {
    type: 'ERROR',
    body:
      "0:127: '>' :  wrong operand types: no operation '>' exists that takes a left-hand operand of type ' temp mediump int' and a right operand of type ' const float' (or there is no acceptable conversion)",
  },
  {
    type: 'PRINT',
    body: 'Connected',
  },
];

const LogItem = props => {
  let logStyles = [styles.logItem];
  if (props.type == 'ERROR') logStyles.push(styles.logItemError);
  if (props.type == 'SYSTEM') logStyles.push(styles.logItemSystem);

  return (
    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
      <View style={{ flex: 0, paddingRight: 16, width: 70 }}>
        <Text style={logStyles}>{props.type}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={logStyles}>{props.body}</Text>
      </View>
    </View>
  );
};

const LogList = () => {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#000',
        paddingTop: 12,
        borderTopWidth: 2,
        borderColor: '#444',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderColor: '#444',
        }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Clear</Text>
        <Text style={{ color: '#fff' }}>Local logs</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Hide</Text>
      </View>
      <FlatList
        data={FAKELOG}
        renderItem={({ item }) => <LogItem type={item.type} body={item.body} />}
        inverted={true}
        style={{ height: '50%' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}></FlatList>
    </View>
  );
};

const GameHeader = () => {
  const [inviting, setInviting] = useState(false);

  return (
    <Fragment>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View
        style={{
          width: '100%',
          backgroundColor: '#000',
          borderBottomWidth: 1,
          borderColor: '#222',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            paddingBottom: 8,
            paddingHorizontal: 16,
          }}
          onPress={() => {
            switchTo('navigator');
          }}>
          <Text style={{ color: '#bbb' }}>Return to Castle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingBottom: 8,
            paddingHorizontal: 16,
          }}
          onPress={() => {
            if (inviting) {
              setInviting(false);
            } else {
              setInviting(true);
            }
          }}>
          <Text style={{ color: '#bbb' }}>Invite</Text>
        </TouchableOpacity>
      </View>
      {inviting ? <InviteBar /> : <Fragment />}
    </Fragment>
  );
};

const InviteBar = () => {
  const [copied, setCopied] = useState(false);

  return (
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#222',
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: '#222',
          borderRadius: 4,
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
        onPress={() => {
          Clipboard.setString('@revillo/gemzen#42EqUCXQ3');
          setCopied(true);
        }}>
        <Text style={{ flex: 1, color: '#fff' }}>
          {copied ? 'Copied!' : '@revillo/gemzen#42EqUCXQ3'}
        </Text>
        <FastImage
          style={{
            flex: 0,
            width: 24,
            height: 12,
          }}
          source={require('../assets/images/hyperlink.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

const MainSwitcher = () => {
  // `mode` is one of `'game'` or `'navigator'`
  const [mode, setMode] = useState('navigator');

  let gameRunning;
  [gameRunning, setGameRunning] = useState(false);

  switchTo = setMode;

  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <View style={{ flex: 1 }}>
        <View
          style={
            !gameRunning ? styles.hidden : mode === 'game' ? styles.fullscreen : styles.windowed
          }>
          {mode === 'game' && <GameHeader />}
          <GameScreen />
          {/* {mode === 'game' && (
            <LogList />
          )} */}
          {mode === 'navigator' && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (gameRunning) {
                    setMode('game');
                  }
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <RootNavigator />
      </View>
    </View>
  );
};

export default MainSwitcher;
