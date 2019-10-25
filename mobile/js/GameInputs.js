import React, { Fragment, useRef } from 'react';
import { View, Text, ImageBackground } from 'react-native';

import { GhostInputView, GhostInputZone } from './ghost/GhostInput';

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

const SplitInputs = () => {
  const upDownZoneRef = useRef(null);
  const leftRightZoneRef = useRef(null);
  const actionZoneRef = useRef(null);

  return (
    <Fragment>
      <GhostInputZone zoneRef={upDownZoneRef} style={splitVerticalInputStyle}>
        <GhostInputView style={inputStyle} zoneRef={upDownZoneRef} config={{ keyCode: 'up' }}>
          <Triangle direction="up" size={25} />
        </GhostInputView>
        <GhostInputView style={inputStyle} zoneRef={upDownZoneRef} config={{ keyCode: 'down' }}>
          <Triangle direction="down" size={25} />
        </GhostInputView>
      </GhostInputZone>
      <GhostInputZone zoneRef={leftRightZoneRef} style={splitHorizontalInputStyle}>
        <GhostInputView style={inputStyle} zoneRef={leftRightZoneRef} config={{ keyCode: 'left' }}>
          <Triangle direction="left" size={25} />
        </GhostInputView>
        <GhostInputView style={inputStyle} zoneRef={leftRightZoneRef} config={{ keyCode: 'right' }}>
          <Triangle direction="right" size={25} />
        </GhostInputView>
      </GhostInputZone>
      <GhostInputZone zoneRef={actionZoneRef} style={splitActionInputStyle}>
        <GhostInputView style={inputStyle} zoneRef={actionZoneRef} config={{ keyCode: 'return' }}>
          <Text style={inputIconStyle}>⏎</Text>
        </GhostInputView>
      </GhostInputZone>
    </Fragment>
  );
};

const DPadInputs = () => {
  const dpadZoneRef = useRef(null);
  const actionZoneRef = useRef(null);

  return (
    <Fragment>
      <ImageBackground
        source={require('../assets/images/dpad-full.png')}
        style={dpadInputStyle}>
        <GhostInputZone zoneRef={dpadZoneRef} style={{ flex: 1 }}>
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
      <GhostInputZone zoneRef={actionZoneRef} style={dpadActionInputStyle}>
        <GhostInputView style={inputStyle} zoneRef={actionZoneRef} config={{ keyCode: 'return' }}>
          <Text style={inputIconStyle}>⏎</Text>
        </GhostInputView>
      </GhostInputZone>
    </Fragment>
  );
};

const GameInputs = ({ visible, inputsMode }) => {
  if (!visible || inputsMode === INPUTS_MODE_NONE) {
    return null;
  } else if (inputsMode === INPUTS_MODE_SPLIT) {
    return <SplitInputs />;
  } else if (inputsMode === INPUTS_MODE_DPAD) {
    return <DPadInputs />;
  }
};

export default GameInputs;
