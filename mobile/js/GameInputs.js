import React, { Fragment, useState } from 'react';
import { View, Text } from 'react-native';

import GhostInputView from './ghost/GhostInputView';
import { split } from 'apollo-link';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
}

const Triangle = (props) => {
  const baseStyle = {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  }

  const arrowStyles = {
    up: {
      borderLeftWidth: props.size / 2,
      borderRightWidth: props.size / 2,
      borderBottomWidth: props.size * .85,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#ffffffbb',
      marginTop: -(props.size / 5),
    },
    down: {
      borderLeftWidth: props.size / 2,
      borderRightWidth: props.size / 2,
      borderTopWidth: props.size * .85,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: '#ffffffbb',
      marginBottom: -(props.size / 5),
    },
    left: {
      borderTopWidth: props.size / 2,
      borderBottomWidth: props.size / 2,
      borderRightWidth: props.size * .85,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: '#ffffffbb',
      marginLeft: -(props.size / 5),
    },
    right: {
      borderTopWidth: props.size / 2,
      borderBottomWidth: props.size / 2,
      borderLeftWidth: props.size * .85,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: '#ffffffbb',
      marginRight: -(props.size / 5),
    }
  }
  
  return (
    <View style={[baseStyle, arrowStyles[props.direction]]}></View>
  )
}

const GameInputs = () => {
  const [inputLayout, setLayout] = useState(true);

  const onPressToggleLayout = () => {
    setLayout(!inputLayout);
  }

  const splitVerticalInputStyle = {
    position: 'absolute',
    bottom: 8,
    left: 8,
  }

  const splitHorizontalInputStyle = {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
  }

  const splitActionInputStyle = {
    position: 'absolute',
    bottom: 94,
    right: 8,
    flexDirection: 'row',
  }

  const dpadVerticalInputStyle = {
    position: 'absolute',
    bottom: 8,
    left: 68,
    height: 206,
    justifyContent: 'space-between',
  }

  const dpadHorizontalInputStyle = {
    position: 'absolute',
    bottom: 68,
    left: 8,
    flexDirection: 'row',
    width: 206,
    justifyContent: 'space-between',
  }

  const dpadActionInputStyle = {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
  }

  return(
    <Fragment>
      <View
        pointerEvents="box-none"
        style={ inputLayout ? splitVerticalInputStyle : dpadVerticalInputStyle }>
        <GhostInputView style={inputStyle} input="up">
          <Triangle direction="up" size={25} />
        </GhostInputView>
        <GhostInputView style={inputStyle} input="down">
          <Triangle direction="down" size={25} />
        </GhostInputView>
      </View>
      <View
        pointerEvents="box-none"
        style={ inputLayout ? splitHorizontalInputStyle : dpadHorizontalInputStyle }>
        <GhostInputView style={inputStyle} input="left">
          <Triangle direction="left" size={25} />
        </GhostInputView>
        <GhostInputView style={inputStyle} input="right">
          <Triangle direction="right" size={25} />
        </GhostInputView>
      </View>
      <View
        pointerEvents="box-none"
        style={ inputLayout ? splitActionInputStyle : dpadActionInputStyle }>
        <GhostInputView style={inputStyle} input="return">
          <Text style={inputIconStyle}>⏎</Text>
        </GhostInputView>
      </View>
      <View style={{ position: 'absolute', top: 0, right: 0, paddingVertical: 8, paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={ onPressToggleLayout }>
          <Text style={{ color: '#bbb' }}>Switch Control Layout</Text>
        </TouchableOpacity>
      </View>
    </Fragment>
  )
};

export default GameInputs;
