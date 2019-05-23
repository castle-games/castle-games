import * as React from 'react';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

import Logs from '~/common/logs';

import '~/components/game/Tools.css';
import { Button, TextInput } from 'carbon-components-react';

//
// Infrastructure
//

let nextEventId = 1;
const sendEvent = (pathId, event) => {
  const eventId = nextEventId++;
  NativeUtil.sendLuaEvent('CASTLE_TOOL_EVENT', { pathId, event: { ...event, eventId } });
  return eventId;
};

const elementTypes = {};

class Tool extends React.PureComponent {
  render() {
    const { element } = this.props;
    const ElemType = elementTypes[element.type];
    if (!ElemType) {
      Logs.error(`'${element.type}' is not a valid UI element type`);
      return null;
    }
    return <ElemType element={element} />;
  }
}

const orderedChildren = (element) => {
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

const renderChildren = (element) =>
  orderedChildren(element).map(({ id, child }) => <Tool key={id} element={child} />);

const STYLES_PANE_CONTAINER = css`
  display: flex;
  flex-direction: column;
`;

class ToolPane extends React.PureComponent {
  render() {
    const { element } = this.props;
    return (
      <div className={STYLES_PANE_CONTAINER}>
        {renderChildren(element).map((c) => (
          <div style={{ margin: '4px' }}>{c}</div>
        ))}
      </div>
    );
  }
}
elementTypes['pane'] = ToolPane;

//
// Components
//

class ToolButton extends React.PureComponent {
  render() {
    const { element } = this.props;
    return (
      <Button
        small
        {...element.props}
        onClick={() => sendEvent(element.pathId, { type: 'onClick' })}>
        {element.props.labelText}
      </Button>
    );
  }
}
elementTypes['button'] = ToolButton;

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
      <TextInput
        labelText=""
        {...element.props}
        id={element.pathId}
        value={this.state.value}
        onChange={(event) => {
          this.setState({
            value: event.target.value,
            lastSentEventId: sendEvent(element.pathId, {
              type: 'onChange',
              value: event.target.value,
            }),
          });
        }}
      />
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

const STYLES_CONTAINER = css`
  width: 300px;
  height: 100%;

  background-color: #171717;

  padding: 8px;

  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 8px;
    height: 100%;
  }

  ::-webkit-scrollbar-track {
    background: black;
  }

  ::-webkit-scrollbar-thumb {
    background: white;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: magenta;
  }
`;

export default class Tools extends React.PureComponent {
  static initialState = {
    root: {
      // Some example data to test with in the browser
      // panes: {
      //   DEFAULT: {
      //     type: 'pane',
      //     props: {
      //       name: 'DEFAULT',
      //     },
      //     children: {
      //       textInputstr2: {
      //         type: 'textInput',
      //         pathId: 'DEFAULTtextInputstr',
      //         props: {
      //           value: 'hello, world',
      //         },
      //       },
      //       textInputstr: {
      //         type: 'textInput',
      //         pathId: 'DEFAULTtextInputstr',
      //         props: {
      //           value: 'hello, world',
      //         },
      //         prevId: 'textInputstr2'
      //       },
      //       count: 2,
      //       lastId: 'textInputstr',
      //     },
      //   },
      // },
    },
    visible: false,
  };

  state = Tools.initialState;

  componentDidMount() {
    window.addEventListener('CASTLE_TOOLS_UPDATE', this._handleUpdate);
    NativeUtil.sendLuaEvent('CASTLE_TOOLS_NEEDS_SYNC', {});
  }

  componentWillUnmount() {
    window.removeEventListener('CASTLE_TOOLS_UPDATE', this._handleUpdate);
  }

  _handleUpdate = (e) => {
    const diff = JSON.parse(e.params);
    // console.log(`diff: ${JSON.stringify(diff, null, 2)}`);

    const prevVisible = this.state.visible;
    this.setState(
      ({ root }) => {
        const newRoot = applyDiff(root, diff);
        const newVisible =
          newRoot.panes &&
          Object.values(newRoot.panes).find(
            (element) => element.children && element.children.count > 0
          );
        return { root: newRoot, visible: newVisible };
      },
      () => {
        if (prevVisible !== this.state.visible) {
          this.props.onLayoutChange && this.props.onLayoutChange();
        }
      }
    );
  };

  clearState() {
    this.setState(Tools.initialState);
  }

  render() {
    // console.log(`render: ${JSON.stringify(this.state.root, null, 2)}`);

    return this.state.visible ? (
      <div id="tools-container" className={STYLES_CONTAINER}>
        {Object.values(this.state.root.panes).map((element, i) => (
          <ToolPane key={(element.props && element.props.name) || i} element={element} />
        ))}
      </div>
    ) : null;
  }
}
