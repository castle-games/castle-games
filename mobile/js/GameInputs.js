import React, { Fragment } from 'react';
import { View, Text } from 'react-native';

import GhostInputView from './ghost/GhostInputView';

const INPUTS_MODE_SPLIT = 0;
const INPUTS_MODE_DPAD = 1;
const INPUTS_MODE_NONE = 2;
export const NUM_GAME_INPUTS_MODES = 3;

const inputStyle = {
  width: 70,
  height: 70,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 35,
  margin: 8,
  backgroundColor: '#99999980',
  borderColor: '#ffffffbb',
  borderWidth: 2,
};

const inputIconStyle = {
  color: '#ffffffbb',
  fontSize: 36,
  fontWeight: 'bold',
};

const Triangle = props => {
  const baseStyle = {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  };

  const arrowStyles = {
    up: {
      borderLeftWidth: props.size / 2,
      borderRightWidth: props.size / 2,
      borderBottomWidth: props.size * 0.85,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#ffffffbb',
      marginTop: -(props.size / 5),
    },
    down: {
      borderLeftWidth: props.size / 2,
      borderRightWidth: props.size / 2,
      borderTopWidth: props.size * 0.85,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: '#ffffffbb',
      marginBottom: -(props.size / 5),
    },
    left: {
      borderTopWidth: props.size / 2,
      borderBottomWidth: props.size / 2,
      borderRightWidth: props.size * 0.85,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: '#ffffffbb',
      marginLeft: -(props.size / 5),
    },
    right: {
      borderTopWidth: props.size / 2,
      borderBottomWidth: props.size / 2,
      borderLeftWidth: props.size * 0.85,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: '#ffffffbb',
      marginRight: -(props.size / 5),
    },
  };

  return <View style={[baseStyle, arrowStyles[props.direction]]}></View>;
};

const splitVerticalInputStyle = {
  position: 'absolute',
  bottom: 8,
  left: 8,
};

const splitHorizontalInputStyle = {
  position: 'absolute',
  bottom: 8,
  right: 8,
  flexDirection: 'row',
};

const splitActionInputStyle = {
  position: 'absolute',
  bottom: 94,
  right: 8,
  flexDirection: 'row',
};

const dpadVerticalInputStyle = {
  position: 'absolute',
  bottom: 8,
  left: 68,
  height: 206,
  justifyContent: 'space-between',
};

const dpadHorizontalInputStyle = {
  position: 'absolute',
  bottom: 68,
  left: 8,
  flexDirection: 'row',
  width: 206,
  justifyContent: 'space-between',
};

const dpadActionInputStyle = {
  position: 'absolute',
  bottom: 8,
  right: 8,
  flexDirection: 'row',
};

const GameInputs = ({ visible, inputsMode }) =>
  !visible || inputsMode === INPUTS_MODE_NONE ? null : (
    <Fragment>
      <View
        pointerEvents="box-none"
        style={inputsMode === INPUTS_MODE_SPLIT ? splitVerticalInputStyle : dpadVerticalInputStyle}>
        <GhostInputView style={inputStyle} input="up">
          <Triangle direction="up" size={25} />
        </GhostInputView>
        <GhostInputView style={inputStyle} input="down">
          <Triangle direction="down" size={25} />
        </GhostInputView>
      </View>
      <View
        pointerEvents="box-none"
        style={
          inputsMode === INPUTS_MODE_SPLIT ? splitHorizontalInputStyle : dpadHorizontalInputStyle
        }>
        <GhostInputView style={inputStyle} input="left">
          <Triangle direction="left" size={25} />
        </GhostInputView>
        <GhostInputView style={inputStyle} input="right">
          <Triangle direction="right" size={25} />
        </GhostInputView>
      </View>
      <View
        pointerEvents="box-none"
        style={inputsMode === INPUTS_MODE_SPLIT ? splitActionInputStyle : dpadActionInputStyle}>
        <GhostInputView style={inputStyle} input="return">
          <Text style={inputIconStyle}>⏎</Text>
        </GhostInputView>
      </View>
    </Fragment>
  );

export default GameInputs;
