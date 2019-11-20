import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

import * as GhostEvents from './ghost/GhostEvents';
import { ScrollView } from 'react-native-gesture-handler';

const ENABLE_TOOLS = true;

//
// Infrastructure
//

// Lua CJSON encodes sparse arrays as objects with stringified keys, use this to convert back
const objectToArray = input => {
  if (Array.isArray(input)) {
    return input;
  }

  const output = [];
  let i = '0' in input ? 0 : 1;
  for (;;) {
    const strI = i.toString();
    if (!(strI in input)) {
      break;
    }
    output.push(input[strI]);
    ++i;
  }
  return output;
};

// For sending tool events back from JS to Lua (eg. value changes)
let nextEventId = 1;
const sendEvent = (pathId, event) => {
  const eventId = nextEventId++;
  GhostEvents.sendAsync('CASTLE_TOOL_EVENT', { pathId, event: { ...event, eventId } });
  return eventId;
};

// Map of element type name (as Lua will refer to an element type by) -> component class
const elementTypes = {};

// Abstract component that reads `element.type` and uses that to instantiate a concrete component
const Tool = ({ element }) => {
  const ElemType = elementTypes[element.type];
  if (!ElemType) {
    console.log(`'${element.type}' is not a valid UI element type`);
    return null;
  }
  return <ElemType element={{ ...element, props: element.props || {} }} />;
};

// Get an ordered array of the children of an element
const orderedChildren = element => {
  if (!element.children) {
    return [];
  }
  if (element.children.count === 0) {
    return [];
  }
  const result = [];
  let id = element.children.lastId;
  while (id !== undefined && id !== null) {
    const child = element.children[id];
    if (!child) {
      break; // This shouldn't really happen...
    }
    result.push({ id, child });
    id = element.children[id].prevId;
  }
  return result.reverse();
};

// Render the children of an element
const renderChildren = element =>
  orderedChildren(element).map(({ id, child }) => <Tool key={id} element={child} />);

// Maintain state for a `value` / `onChange` combination. Returns the current value and a setter for the new value
// that can be invoked in a JS change event (which will then propagate the new value back to Lua). The default prop
// and event names are 'value' and 'onChange' respectively but other ones can be provided.
const useValue = ({ element, propName = 'value', eventName = 'onChange', onNewValue }) => {
  const [lastSentEventId, setLastSentEventId] = useState(null);
  const [value, setValue] = useState(null);

  // Prop changed?
  if (value !== element.props[propName]) {
    // Only apply change if Lua says that it reported our last sent event, otherwise we may overwrite a more
    // up-to-date value that we're storing (eg. new key presses in a text input before the game's value is updated)
    if (lastSentEventId === null || element.lastReportedEventId === lastSentEventId) {
      const newValue = element.props[propName];
      setValue(newValue);
      if (onNewValue) {
        onNewValue(newValue);
      }
    }
  }

  const setValueAndSendEvent = newValue => {
    setValue(newValue);
    setLastSentEventId(
      sendEvent(element.pathId, {
        type: eventName,
        value: newValue,
      })
    );
  };

  return [value, setValueAndSendEvent];
};

// Select the `View` style and layout props from `p`
const VIEW_STYLE_PROPS = {
  alignContent: true,
  alignItems: true,
  alignSelf: true,
  aspectRatio: true,
  borderBottomWidth: true,
  borderEndWidth: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  borderStartWidth: true,
  borderTopWidth: true,
  borderWidth: true,
  bottom: true,
  direction: true,
  display: true,
  end: true,
  flex: true,
  flexBasis: true,
  flexDirection: true,
  flexGrow: true,
  flexShrink: true,
  flexWrap: true,
  height: true,
  justifyContent: true,
  left: true,
  margin: true,
  marginBottom: true,
  marginEnd: true,
  marginHorizontal: true,
  marginLeft: true,
  marginRight: true,
  marginStart: true,
  marginTop: true,
  marginVertical: true,
  maxHeight: true,
  maxWidth: true,
  minHeight: true,
  minWidth: true,
  overflow: true,
  padding: true,
  paddingBottom: true,
  paddingEnd: true,
  paddingHorizontal: true,
  paddingLeft: true,
  paddingRight: true,
  paddingStart: true,
  paddingTop: true,
  paddingVertical: true,
  position: true,
  right: true,
  start: true,
  top: true,
  width: true,
  zIndex: true,
  borderRightColor: true,
  backfaceVisibility: true,
  borderBottomColor: true,
  borderBottomEndRadius: true,
  borderBottomLeftRadius: true,
  borderBottomRightRadius: true,
  borderBottomStartRadius: true,
  borderBottomWidth: true,
  borderColor: true,
  borderEndColor: true,
  borderLeftColor: true,
  borderLeftWidth: true,
  borderRadius: true,
  backgroundColor: true,
  borderRightWidth: true,
  borderStartColor: true,
  borderStyle: true,
  borderTopColor: true,
  borderTopEndRadius: true,
  borderTopLeftRadius: true,
  borderTopRightRadius: true,
  borderTopStartRadius: true,
  borderTopWidth: true,
  borderWidth: true,
  opacity: true,
};
const viewStyleProps = p => {
  if (!p) {
    return {};
  }
  const r = {};
  Object.keys(p).forEach(k => {
    if (VIEW_STYLE_PROPS[k]) {
      r[k] = p[k];
    }
  });
  return r;
};

//
// Components
//

const buttonStyle = {
  padding: 6,
  backgroundColor: '#ddd',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
};

const ToolPane = ({ element }) => <View style={{ padding: 6 }}>{renderChildren(element)}</View>;
elementTypes['pane'] = ToolPane;

const ToolTextInput = ({ element }) => {
  const [value, setValue] = useValue({ element });

  return (
    <View style={{ margin: 4 }}>
      <Text style={{ fontWeight: '900', marginBottom: 2 }}>{element.props.label}</Text>
      <TextInput
        style={{
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 4,
          paddingVertical: 8,
          paddingHorizontal: 12,
          ...viewStyleProps(element.props),
        }}
        returnKeyType="done"
        value={value}
        onChangeText={newText => setValue(newText)}
      />
    </View>
  );
};
elementTypes['textInput'] = ToolTextInput;

const ToolButton = ({ element }) => (
  <TouchableOpacity
    style={{
      ...buttonStyle,
      margin: 4,
      ...viewStyleProps(element.props),
    }}
    onPress={() => sendEvent(element.pathId, { type: 'onClick' })}>
    <Text>{element.props.label}</Text>
  </TouchableOpacity>
);
elementTypes['button'] = ToolButton;

const ToolBox = ({ element }) => (
  <View style={{ margin: 4, ...viewStyleProps(element.props) }}>{renderChildren(element)}</View>
);
elementTypes['box'] = ToolBox;

const ToolSlider = ({ element }) => {
  const [value, setValue] = useValue({ element });

  return (
    <View style={{ margin: 4 }}>
      <Text style={{ fontWeight: '900', marginBottom: 2 }}>{element.props.label}</Text>
      <Slider
        style={{ flex: 1 }}
        minimumValue={element.props.min}
        maximumValue={element.props.max}
        step={element.props.step || 1}
        value={value}
        onValueChange={newValue => setValue(newValue)}
      />
    </View>
  );
};
elementTypes['slider'] = ToolSlider;

const numberToText = number => (typeof number === 'number' ? number.toString() : '0');

const textToNumber = text => {
  const parsed = parseFloat(text);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const ToolNumberInput = ({ element }) => {
  // Maintain `text` separately from `value` to allow incomplete text such as '' or '3.'
  const [text, setText] = useState('');
  const [value, setValue] = useValue({
    element,
    onNewValue: newValue => {
      // Received a new value from Lua -- only update text if it doesn't represent the same
      // value (to allow the user to keep editing)
      if (textToNumber(text) !== newValue) {
        setText(numberToText(newValue));
      }
    },
  });

  const checkAndSetValue = newValue => {
    const { min, max } = element.props;
    if (typeof min === 'number' && newValue < min) {
      newValue = min;
    }
    if (typeof max === 'number' && newValue > max) {
      newValue = max;
    }
    setValue(newValue);
    return newValue;
  };

  const incrementValue = delta =>
    setText(numberToText(checkAndSetValue((value || 0) + delta * (element.props.step || 1))));

  return (
    <View style={{ margin: 4 }}>
      <Text style={{ fontWeight: '900', marginBottom: 2 }}>{element.props.label}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          keyboardType="numeric"
          style={{
            flex: 1,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
            ...viewStyleProps(element.props.textInputStyle),
          }}
          returnKeyType="done"
          value={text}
          onChangeText={newText => {
            // User edited the text -- save the changes and also send updated value to Lua
            setText(newText);
            checkAndSetValue(textToNumber(newText));
          }}
          onBlur={() => {
            // User unfocused the input -- revert text to reflect the value and discard edits
            setText(numberToText(value));
          }}
        />
        <TouchableOpacity
          style={{
            ...buttonStyle,
            width: 32,
            marginLeft: 4,
            ...viewStyleProps(element.props.buttonStyle),
          }}
          onPress={() => incrementValue(1)}>
          <Text>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...buttonStyle,
            width: 32,
            marginLeft: 4,
            ...viewStyleProps(element.props.buttonStyle),
          }}
          onPress={() => incrementValue(-1)}>
          <Text>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
elementTypes['numberInput'] = ToolNumberInput;

//
// Container
//

// We get state diffs from Lua. This function applies those diffs to a previous state to produce the new state.
const applyDiff = (t, diff) => {
  if (diff == null) {
    return t;
  }

  // If it's an exact diff just return it
  if (diff.__exact) {
    delete diff.__exact;
    return diff;
  }

  // Copy untouched keys, then apply diffs to touched keys
  t = typeof t === 'object' ? t : {};
  const u = {};
  for (let k in t) {
    if (!(k in diff)) {
      u[k] = t[k];
    }
  }
  for (let k in diff) {
    const v = diff[k];
    if (typeof v === 'object') {
      u[k] = applyDiff(t[k], v);
    } else if (v !== '__NIL') {
      u[k] = v;
    }
  }
  return u;
};

// Top-level tools container -- watches for Lua <-> JS tool events and renders the tools overlaid in its parent
export default Tools = ({ eventsReady, visible }) => {
  // Maintain tools state
  const [root, setRoot] = useState({});

  // Listen for updates
  GhostEvents.useListen({
    eventsReady,
    eventName: 'CASTLE_TOOLS_UPDATE',
    handler: diffJson => {
      const diff = JSON.parse(diffJson);
      setRoot(oldRoot => applyDiff(oldRoot, diff));
    },
  });

  // Check prop, feature flag, and that we have at least one non-empty pane
  visible =
    visible &&
    ENABLE_TOOLS &&
    root.panes &&
    Object.values(root.panes).find(element => element.children && element.children.count > 0);
  if (!visible) {
    return null;
  }

  // Render the container
  return (
    <View style={{ flex: 0.75, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1, paddingBottom: 100 }}>
        {Object.values(root.panes).map((element, i) => (
          <ToolPane key={element.props.name || i} element={element} />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};
