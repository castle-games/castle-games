import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';
import {
  Grommet,
  Box,
  Heading,
  Markdown,
  Paragraph,
  Text,
  Button,
  FormField,
  TextInput,
} from 'grommet';

import Logs from '~/common/logs';

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

class ToolBox extends React.PureComponent {
  render() {
    const { element } = this.props;
    return <Box {...element.props}>{renderChildren(element)}</Box>;
  }
}
elementTypes['box'] = ToolBox;

class ToolHeading extends React.PureComponent {
  render() {
    const { element } = this.props;
    return <Heading {...element.props}>{element.props.text}</Heading>;
  }
}
elementTypes['heading'] = ToolHeading;

class ToolMarkdown extends React.PureComponent {
  render() {
    const { element } = this.props;
    return <Markdown {...element.props}>{element.props.text}</Markdown>;
  }
}
elementTypes['markdown'] = ToolMarkdown;

class ToolParagraph extends React.PureComponent {
  render() {
    const { element } = this.props;
    return <Paragraph {...element.props}>{element.props.text}</Paragraph>;
  }
}
elementTypes['paragraph'] = ToolParagraph;

class ToolText extends React.PureComponent {
  render() {
    const { element } = this.props;
    return <Text {...element.props}>{element.props.text}</Text>;
  }
}
elementTypes['text'] = ToolText;

class ToolButton extends React.PureComponent {
  render() {
    const { element } = this.props;
    return (
      <Button {...element.props} onClick={() => sendEvent(element.pathId, { type: 'onClick' })}>
        {element.props.button}
      </Button>
    );
  }
}
elementTypes['button'] = ToolButton;

const renderLabelled = (label, inside) =>
  label ? <FormField label={label}>{inside}</FormField> : inside;

class ToolTextInput extends React.PureComponent {
  state = {
    value: this.props.element.props.value,
    lastSentEventId: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (
      state.lastSentEventId === null ||
      props.element.lastReportedEventId >= state.lastSentEventId
    ) {
      return {
        value: props.element.props.value,
      };
    }
    return null;
  }

  render() {
    const { element } = this.props;
    return renderLabelled(
      element.props.label,
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
        }}>
        {element.props.button}
      </TextInput>
    );
  }
}
elementTypes['textInput'] = ToolTextInput;

class ToolPane extends React.PureComponent {
  render() {
    const { element } = this.props;
    return (
      <Box pad="small" {...element.props}>
        {renderChildren(element)}
      </Box>
    );
  }
}
elementTypes['pane'] = ToolPane;

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

  background-color: ${Constants.toolsTheme.global.colors.background};
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
  state = {
    root: {},
  };

  componentDidMount() {
    window.addEventListener('CASTLE_TOOLS_UPDATE', this._handleUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener('CASTLE_TOOLS_UPDATE', this._handleUpdate);
  }

  _handleUpdate = (e) => {
    const diff = JSON.parse(e.params);
    this.setState(({ root }) => ({ root: applyDiff(root, diff) }));
  };

  render() {
    // console.log(`render: ${JSON.stringify(this.state.root, null, 2)}`);

    return (
      <div className={STYLES_CONTAINER}>
        <Grommet theme={Constants.toolsTheme}>
          {this.state.root.panes ? (
            Object.values(this.state.root.panes).map((element) => (
              <ToolPane key={element.props.name} element={element} />
            ))
          ) : (
            <Box pad="small">
              <Text>No tools...</Text>
            </Box>
          )}
        </Grommet>
      </div>
    );
  }
}
