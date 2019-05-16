import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { Grommet, Box, Heading, Markdown, Paragraph, Text } from 'grommet';

import Logs from '~/common/logs';

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
  return Object.values(element.children)
    .filter((element) => typeof element === 'object')
    .sort((a, b) => a.order - b.order);
};

const renderChildren = (element) =>
  orderedChildren(element).map((childElement) => <Tool element={childElement} />);

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
    Logs.system(JSON.stringify(this.state.root, null, 2));

    return (
      <div className={STYLES_CONTAINER}>
        <Grommet theme={Constants.toolsTheme}>
          {this.state.root.panes ? (
            Object.values(this.state.root.panes).map((element) => <ToolPane element={element} />)
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
