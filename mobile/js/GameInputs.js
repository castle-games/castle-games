import React, { Fragment, useRef } from 'react';
import { View, Text, ImageBackground } from 'react-native';

import { GhostInputView, GhostInputZone } from './ghost/GhostInput';

// These params only change things on Android -- iOS has a fixed haptics strength
const HAPTICS = { duration: 20, amplitude: 80 };

const INPUTS_MODE_DPAD = 0;
const INPUTS_MODE_NONE = 1;
export const NUM_GAME_INPUTS_MODES = 2;

export const GAME_INPUTS_ACTION_KEY_CODES = [
  'z',
  'return: ⏎',
  'lshift: ⇪',
  'space: ␣',
];

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

const dpadInputStyle = {
  position: 'absolute',
  bottom: 16,
  left: 16,
  height: 160,
  width: 160,
};

// D-pad tuning constants -- these are the human-editable values
const dpadDiagonalSize = 35;
const dpadDiagonalMargin = 5;
const dpadCardinalTangentSize = 40; // Size along the edge of the d-pad
const dpadCardinalNormalSize = 40; // Size perpendicular to the edge of the d-pad

// NOTE: These values must just be computed from the above -- preferrably don't edit manually!
const dpadDiagonalSizePercent = `${dpadDiagonalSize}%`;
const dpadDiagonalMarginPercent = `${dpadDiagonalMargin}%`;
const dpadCardinalTangentSizePercent = `${dpadCardinalTangentSize}%`;
const dpadCardinalNormalSizePercent = `${dpadCardinalNormalSize}%`;
const dpadCardinalTangentCenteringPercent = `${0.5 * (100 - dpadCardinalTangentSize)}%`;

const dpadUpInputStyle = {
  // backgroundColor: '#00ff0033',
  width: dpadCardinalTangentSizePercent,
  height: dpadCardinalNormalSizePercent,
  position: 'absolute',
  top: 0,
  left: dpadCardinalTangentCenteringPercent,
};

const dpadDownInputStyle = {
  // backgroundColor: '#00ff0033',
  width: dpadCardinalTangentSizePercent,
  height: dpadCardinalNormalSizePercent,
  position: 'absolute',
  bottom: 0,
  left: dpadCardinalTangentCenteringPercent,
};

const dpadLeftInputStyle = {
  // backgroundColor: '#ff000033',
  width: dpadCardinalNormalSizePercent,
  height: dpadCardinalTangentSizePercent,
  position: 'absolute',
  top: dpadCardinalTangentCenteringPercent,
  left: 0,
};

const dpadRightInputStyle = {
  // backgroundColor: '#ff000033',
  width: dpadCardinalNormalSizePercent,
  height: dpadCardinalTangentSizePercent,
  position: 'absolute',
  top: dpadCardinalTangentCenteringPercent,
  right: 0,
};

const dpadUpLeftInputStyle = {
  // backgroundColor: '#0000ff33',
  width: dpadDiagonalSizePercent,
  height: dpadDiagonalSizePercent,
  position: 'absolute',
  top: dpadDiagonalMarginPercent,
  left: dpadDiagonalMarginPercent,
};

const dpadUpRightInputStyle = {
  // backgroundColor: '#0000ff33',
  width: dpadDiagonalSizePercent,
  height: dpadDiagonalSizePercent,
  position: 'absolute',
  top: dpadDiagonalMarginPercent,
  right: dpadDiagonalMarginPercent,
};

const dpadDownLeftInputStyle = {
  // backgroundColor: '#0000ff33',
  width: dpadDiagonalSizePercent,
  height: dpadDiagonalSizePercent,
  position: 'absolute',
  bottom: dpadDiagonalMarginPercent,
  left: dpadDiagonalMarginPercent,
};

const dpadDownRightInputStyle = {
  // backgroundColor: '#0000ff33',
  width: dpadDiagonalSizePercent,
  height: dpadDiagonalSizePercent,
  position: 'absolute',
  bottom: dpadDiagonalMarginPercent,
  right: dpadDiagonalMarginPercent,
};

const dpadActionInputStyle = {
  position: 'absolute',
  bottom: 8,
  right: 8,
  flexDirection: 'row',
};

const DPadInputs = ({ actionKeyCode }) => {
  const dpadZoneRef = useRef(null);
  const actionZoneRef = useRef(null);

  return (
    <Fragment>
      <ImageBackground source={require('../assets/images/dpad-full.png')} style={dpadInputStyle}>
        <GhostInputZone zoneRef={dpadZoneRef} haptics={HAPTICS} style={{ flex: 1 }}>
          <GhostInputView
            style={dpadUpInputStyle}
            zoneRef={dpadZoneRef}
            config={{ keyCode: 'up' }}></GhostInputView>
          <GhostInputView
            style={dpadDownInputStyle}
            zoneRef={dpadZoneRef}
            config={{ keyCode: 'down' }}></GhostInputView>
          <GhostInputView
            style={dpadLeftInputStyle}
            zoneRef={dpadZoneRef}
            config={{ keyCode: 'left' }}></GhostInputView>
          <GhostInputView
            style={dpadRightInputStyle}
            zoneRef={dpadZoneRef}
            config={{ keyCode: 'right' }}></GhostInputView>
          <GhostInputView
            style={dpadUpLeftInputStyle}
            zoneRef={dpadZoneRef}
            config={{ keyCode: 'up_left' }}></GhostInputView>
          <GhostInputView
            style={dpadUpRightInputStyle}
            zoneRef={dpadZoneRef}
            config={{ keyCode: 'up_right' }}></GhostInputView>
          <GhostInputView
            style={dpadDownLeftInputStyle}
            zoneRef={dpadZoneRef}
            config={{ keyCode: 'down_left' }}></GhostInputView>
          <GhostInputView
            style={dpadDownRightInputStyle}
            zoneRef={dpadZoneRef}
            config={{ keyCode: 'down_right' }}></GhostInputView>
        </GhostInputZone>
      </ImageBackground>
      <GhostInputZone zoneRef={actionZoneRef} haptics={HAPTICS} style={dpadActionInputStyle}>
        <GhostInputView
          style={inputStyle}
          zoneRef={actionZoneRef}
          config={{ keyCode: actionKeyCode.replace(/:.*/, '') }}>
          <Text style={inputIconStyle}>{actionKeyCode.replace(/.*: /, '')}</Text>
        </GhostInputView>
      </GhostInputZone>
    </Fragment>
  );
};

const GameInputs = ({ visible, inputsMode, actionKeyCode }) => {
  if (!visible || inputsMode === INPUTS_MODE_NONE) {
    return null;
  } else if (inputsMode === INPUTS_MODE_DPAD) {
    // We use `key={actionKeyCode}` here to force a re-mount when `actionKeyCode` changes
    return <DPadInputs key={actionKeyCode} actionKeyCode={actionKeyCode} />;
  }
};

export default GameInputs;
