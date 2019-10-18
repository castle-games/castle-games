import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

import * as GhostEvents from './ghost/GhostEvents';

const ENABLE_TOOLS = false;

//
// Infrastructure
//

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

let nextEventId = 1;
const sendEvent = (pathId, event) => {
  const eventId = nextEventId++;
  GhostEvents.sendAsync('CASTLE_TOOL_EVENT', { pathId, event: { ...event, eventId } });
  return eventId;
};

const elementTypes = {};

const Tool = ({ element }) => {
  const ElemType = elementTypes[element.type];
  if (!ElemType) {
    console.log(`'${element.type}' is not a valid UI element type`);
    return null;
  }
  return <ElemType element={element} />;
};

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

const renderChildren = element =>
  orderedChildren(element).map(({ id, child }) => <Tool key={id} element={child} />);

const ToolPane = ({ element }) => <View style={{ padding: 6 }}>{renderChildren(element)}</View>;
elementTypes['pane'] = ToolPane;

//
// Components
//

class ToolTextInput extends React.PureComponent {
  state = {
    value: this.props.element.props.value,
    lastSentEventId: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (
      state.lastSentEventId === null ||
      props.element.lastReportedEventId == state.lastSentEventId
    ) {
      return {
        value: props.element.props.value,
      };
    }
    return null;
  }

  render() {
    const { element } = this.props;

    return (
      <View style={{ padding: 4 }}>
        <Text style={{ fontWeight: '900' }}>{element.props && element.props.label}</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={this.state.value}
          onChangeText={newText => {
            this.setState({
              value: newText,
              lastSentEventId: sendEvent(element.pathId, {
                type: 'onChange',
                value: newText,
              }),
            });
          }}
        />
      </View>
    );
  }
}
elementTypes['textInput'] = ToolTextInput;

//
// Container
//

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

export const useTools = ({ eventsReady }) => {
  const [root, setRoot] = useState({});

  GhostEvents.useListen({
    eventsReady,
    eventName: 'CASTLE_TOOLS_UPDATE',
    handler: diffJson => {
      const diff = JSON.parse(diffJson);
      setRoot(oldRoot => applyDiff(oldRoot, diff));
    },
  });

  const visible =
    ENABLE_TOOLS &&
    root.panes &&
    Object.values(root.panes).find(element => element.children && element.children.count > 0);

  const render = visible ? (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {Object.values(root.panes).map((element, i) => (
        <ToolPane key={(element.props && element.props.name) || i} element={element} />
      ))}
    </View>
  ) : null;

  return {
    visible,
    render,
  };
};
