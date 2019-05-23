import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

import Logs from '~/common/logs';


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
        {renderChildren(element)}
      </div>
    );
  }
}
elementTypes['pane'] = ToolPane;


//
// Components
//

// class ToolBox extends React.PureComponent {
//   render() {
//     const { element } = this.props;
//     return <Box {...element.props}>{renderChildren(element)}</Box>;
//   }
// }
// elementTypes['box'] = ToolBox;

// class ToolSection extends React.PureComponent {
//   render() {
//     const { element } = this.props;
//     return (
//       <Accordion
//         animate={false}
//         activeIndex={element.active ? [0] : []}
//         onActive={(arr) => sendEvent(element.pathId, { type: 'onActive', value: arr.length > 0 })}>
//         <AccordionPanel {...element.props}>
//           <Box pad={{ left: 'small', top: 'small', bottom: 'small' }}>
//             {renderChildren(element)}
//           </Box>
//         </AccordionPanel>
//       </Accordion>
//     );
//   }
// }
// elementTypes['section'] = ToolSection;

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
        {...element.props}
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

  border-left: 1px solid ${Constants.colors.background4};

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
    root: {},
    visible: true,
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

        // <Grommet theme={Constants.toolsTheme}>
        //   {Object.values(this.state.root.panes).map((element, i) => (
        //     <ToolPane key={(element.props && element.props.name) || i} element={element} />
        //   ))}
        // </Grommet>

    return this.state.visible ? (
      <div className={STYLES_CONTAINER}>
      </div>
    ) : null;
  }
}
