import React, { useState, Fragment } from 'react';
import { View, Text, StatusBar, Clipboard } from 'react-native';
import FastImage from 'react-native-fast-image';

import { TouchableOpacity } from 'react-native-gesture-handler';

import * as MainSwitcher from './MainSwitcher';

// The bar displaying the invite link
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

const ENABLE_INVITING = false;

const GameHeader = ({ game, extras, onToggleShowInputs }) => {
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
            MainSwitcher.switchTo('navigator');
          }}>
          <Text style={{ color: '#bbb' }}>Return to Castle</Text>
        </TouchableOpacity>
        {ENABLE_INVITING ? (
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
        ) : null}
        <TouchableOpacity
          style={{
            paddingBottom: 8,
            paddingHorizontal: 16,
          }}
          onPress={onToggleShowInputs}>
          <Text style={{ color: '#bbb' }}>Toggle inputs</Text>
        </TouchableOpacity>
      </View>
      {inviting ? <InviteBar /> : null}
    </Fragment>
  );
};

export default GameHeader;
