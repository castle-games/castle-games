import * as React from 'react';
import * as NativeUtil from '~/native/nativeutil';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import Logs from '~/common/logs';

import '~/components/game/Tools.css';
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  Dropdown,
  NumberInput,
  Slider,
  RadioButton,
  Tab,
  Tabs,
  TextArea,
  TextInput,
  Toggle,
} from 'carbon-components-react';

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
    return <div className={STYLES_PANE_CONTAINER}>{renderChildren(element)}</div>;
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
        {...element.props}
        small={!(element.props && element.props.big)}
        kind={(element.props && element.props.kind) || 'secondary'}
        onClick={() => sendEvent(element.pathId, { type: 'onClick' })}>
        {element.props.label}
      </Button>
    );
  }
}
elementTypes['button'] = ToolButton;

class ToolCheckbox extends React.PureComponent {
  state = {
    checked: this.props.element.props.checked,
    lastSentEventId: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (
      state.lastSentEventId === null ||
      props.element.lastReportedEventId == state.lastSentEventId
    ) {
      return {
        checked: props.element.props.checked,
      };
    }
    return null;
  }

  render() {
    const { element } = this.props;
    return (
      <Checkbox
        {...element.props}
        id={element.pathId}
        labelText={element.props && element.props.label}
        checked={this.state.checked}
        onChange={(checked) => {
          this.setState({
            checked,
            lastSentEventId: sendEvent(element.pathId, {
              type: 'onChange',
              checked,
            }),
          });
        }}
      />
    );
  }
}
elementTypes['checkbox'] = ToolCheckbox;

class ToolDropdown extends React.PureComponent {
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
      <Dropdown
        {...element.props}
        id={element.pathId}
        selectedItem={this.state.value}
        titleText={element.props && !element.props.hideLabel ? element.props.label : null}
        label={
          element.props && element.props.placeholder
            ? element.props.placeholder
            : 'Select an option...'
        }
        onChange={({ selectedItem }) => {
          this.setState({
            value: selectedItem,
            lastSentEventId: sendEvent(element.pathId, {
              type: 'onChange',
              value: selectedItem,
            }),
          });
        }}
      />
    );
  }
}
elementTypes['dropdown'] = ToolDropdown;

class ToolNumberInput extends React.PureComponent {
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
      <NumberInput
        {...element.props}
        id={element.pathId}
        value={this.state.value}
        onChange={(event) => {
          this.setState({
            value: event.imaginaryTarget.valueAsNumber,
            lastSentEventId: sendEvent(element.pathId, {
              type: 'onChange',
              value: event.imaginaryTarget.valueAsNumber,
            }),
          });
        }}
      />
    );
  }
}
elementTypes['numberInput'] = ToolNumberInput;

class ToolRadioButtonGroup extends React.PureComponent {
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

    let maybeLabel = null;
    if (element.props && element.props.label && !element.props.hideLabel) {
      maybeLabel = (
        <label
          htmlFor={element.pathId}
          className={`bx--label${element.props.disabled ? `  bx--label--disabled` : ''}`}>
          {element.props.label}
        </label>
      );
    }

    let maybeHelperText = null;
    if (element.props && element.props.helperText) {
      maybeHelperText = (
        <helperText
          htmlFor={element.pathId}
          className={`bx--form__helper-text${
            element.props.disabled ? `  bx--form__helper-text--disabled` : ''
          }`}>
          {element.props.helperText}
        </helperText>
      );
    }

    return (
      <div className="bx--form-item">
        {maybeLabel}
        {maybeHelperText}
        <div
          className={
            element.props && element.props.horizontal
              ? 'bx--radio-button-group'
              : 'bx--radio-button-group--vertical'
          }>
          {((element.props && element.props.items) || []).map((item) => (
            <RadioButton
              key={item}
              item={item}
              labelText={item}
              checked={this.state.value == item}
              disabled={element.props && element.props.disabled}
              onChange={(value, name, event) => {
                if (event.target.checked) {
                  this.setState({
                    value: item,
                    lastSentEventId: sendEvent(element.pathId, {
                      type: 'onChange',
                      value: item,
                    }),
                  });
                }
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}
elementTypes['radioButtonGroup'] = ToolRadioButtonGroup;

class ToolSection extends React.PureComponent {
  render() {
    const { element } = this.props;
    return (
      <Accordion>
        <AccordionItem
          {...element.props}
          ref={(r) => (this._accordionItemRef = r)}
          title={element.props && element.props.label}
          open={element.open}
          onHeadingClick={({ isOpen }) => {
            sendEvent(element.pathId, { type: 'onChange', open: isOpen });
            // Make it listen to our `element.open` state...
            this._accordionItemRef &&
              this._accordionItemRef.setState({ open: element.open, prevOpen: element.open });
          }}>
          {renderChildren(element)}
        </AccordionItem>
      </Accordion>
    );
  }
}
elementTypes['section'] = ToolSection;

class ToolSlider extends React.PureComponent {
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
      <Slider
        {...element.props}
        id={element.pathId}
        labelText={element.props && element.props.label}
        value={this.state.value}
        onChange={({ value }) => {
          value = typeof value === 'number' ? value : Number.parseFloat(value);
          this.setState({
            value,
            lastSentEventId: sendEvent(element.pathId, {
              type: 'onChange',
              value,
            }),
          });
        }}
      />
    );
  }
}
elementTypes['slider'] = ToolSlider;

class ToolTabs extends React.PureComponent {
  componentDidMount() {
    const { element } = this.props;
    const children = orderedChildren(element).filter(({ id, child }) => child.type == 'tab');
    if (children[0]) {
      sendEvent(children[0].child.pathId, { type: 'onActive', value: true });
    }
  }

  render() {
    const { element } = this.props;

    const children = orderedChildren(element).filter(({ id, child }) => child.type == 'tab');

    return (
      <div className="castle--tabs-container">
        <Tabs
          {...element.props}
          onSelectionChange={(activeIndex) =>
            children.forEach(({ id, child }, childIndex) =>
              sendEvent(child.pathId, { type: 'onActive', value: childIndex === activeIndex })
            )
          }>
          {children.map(({ id, child }) => (
            <Tab key={id} {...child.props} href="javascript:void(0);">
              {renderChildren(child)}
            </Tab>
          ))}
        </Tabs>
      </div>
    );
  }
}
elementTypes['tabs'] = ToolTabs;

class ToolTextArea extends React.PureComponent {
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
      <TextArea
        {...element.props}
        id={element.pathId}
        labelText={element.props && element.props.label}
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
elementTypes['textArea'] = ToolTextArea;

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
        id={element.pathId}
        labelText={element.props && element.props.label}
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

class ToolToggle extends React.PureComponent {
  state = {
    toggled: this.props.element.props.toggled,
    lastSentEventId: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (
      state.lastSentEventId === null ||
      props.element.lastReportedEventId == state.lastSentEventId
    ) {
      return {
        toggled: props.element.props.toggled,
      };
    }
    return null;
  }

  render() {
    const { element } = this.props;
    return (
      <Toggle
        {...element.props}
        id={element.pathId}
        toggled={this.state.toggled}
        onToggle={(toggled) => {
          this.setState({
            toggled,
            lastSentEventId: sendEvent(element.pathId, {
              type: 'onToggle',
              toggled,
            }),
          });
        }}
      />
    );
  }
}
elementTypes['toggle'] = ToolToggle;

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

  /* Based on the 'g90' theme (https://www.carbondesignsystem.com/guidelines/themes/) which 'Tools.scss' uses */
  color: #f3f3f3;
  background-color: #171717;

  /* Inputs seem to not properly hide the spinner buttons */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Make input elements stretch to width of container */
  .bx--form-item {
    align-items: stretch !important;
  }

  /* Sliders are too wide by default */
  .bx--slider {
    min-width: 0 !important;
    flex: 1;
  }

  /* Fix number input fonts */
  input[type='number'] {
    font-family: ${Constants.font.mono} !important;
  }

  /* Justify radio button labels to left */
  .bx--radio-button-group--vertical .bx--radio-button__label {
    justify-content: flex-start !important;
  }

  /* Make accordion children stretch */
  .bx--accordion__item--active .bx--accordion__content {
    padding-left: 1rem !important;
    padding-right: 0.8rem !important;
    padding-bottom: 0.8rem !important;
  }

  /* Make tab headers fit */
  .bx--tabs__nav {
    width: 100% !important;
    display: flex !important;
    flex-direction: row !important;
  }
  .bx--tabs__nav-item {
    display: flex !important;
    flex: 1 !important;
    width: auto !important;
  }
  a.bx--tabs__nav-link,
  a.bx--tabs__nav-link:focus,
  a.bx--tabs__nav-link:active {
    display: flex !important;
    flex: 1 !important;
    width: auto !important;
  }

  /* Add border around tabs container */
  .castle--tabs-container {
    border-bottom: 1px solid #3d3d3d !important;
    padding-bottom: 0.6rem !important;
  }

  /* Add some general bottom margin */
  .bx--number,
  .bx--text-input__field-wrapper,
  .bx--text-area__wrapper,
  .bx--dropdown,
  .bx--radio-button-group--vertical,
  .bx--slider-container,
  .bx--accordion,
  .bx--toggle__label,
  .bx--btn,
  .castle--tabs-container {
    margin-bottom: 14px !important;
  }

  padding: 14px;

  overflow-y: scroll;
  overflow-x: hidden;

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

const DEBUG_PREPOPULATED = false;

export default class Tools extends React.PureComponent {
  static initialState = {
    root: DEBUG_PREPOPULATED
      ? {
          panes: {
            DEFAULT: {
              type: 'pane',
              props: {
                name: 'DEFAULT',
              },
              children: {
                slidernumber2: {
                  type: 'slider',
                  prevId: 'numberInputnumber',
                  pathId: 'DEFAULTslidernumber2',
                  props: {
                    max: 100,
                    label: 'number2',
                    min: 0,
                    value: 50,
                  },
                },
                textInputstring: {
                  type: 'textInput',
                  prevId: 'tabstabs1',
                  pathId: 'DEFAULTtextInputstring',
                  props: {
                    value: 'hello, world',
                    label: 'string',
                    helperText: 'Enter a string here!',
                  },
                },
                dropdowndrop: {
                  type: 'dropdown',
                  prevId: 'slidernumber2',
                  pathId: 'DEFAULTdropdowndrop',
                  props: {
                    items: ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'],
                    label: 'drop',
                    helperText: 'Choose a thing!',
                    invalid: false,
                    invalidText: "I don't like this value... :(",
                  },
                },
                lastId: 'buttonWoah!',
                'DMY1bkDr5VQ1PDd5OjQYiw==': {
                  type: 'toggle',
                  prevId: 'checkboxboolean',
                  pathId: 'e2835Rmh7HzdMi5y+ym0Ig==',
                  props: {
                    labelA: 'boolean2 on',
                    labelB: 'boolean2 off',
                    toggled: true,
                  },
                },
                radioButtonGroupradio: {
                  type: 'radioButtonGroup',
                  prevId: 'dropdowndrop',
                  pathId: 'wBvaeF6UMYqdYu9SLNnJfw==',
                  props: {
                    items: ['alpha', 'beta', 'gamma'],
                    label: 'radio',
                    value: 'alpha',
                  },
                },
                textAreastring2: {
                  type: 'textArea',
                  prevId: 'radioButtonGroupradio',
                  pathId: 'DEFAULTtextAreastring2',
                  props: {
                    label: 'string2',
                    rows: 10,
                    value:
                      'This is a longer piece of text! Have fun editing this one. :)\n\nOh and this is a new paragraph!\n',
                  },
                },
                checkboxboolean: {
                  type: 'checkbox',
                  prevId: 'textInputstring',
                  pathId: 'DEFAULTcheckboxboolean',
                  props: {
                    label: 'boolean',
                    checked: true,
                  },
                },
                'sectionAnother section': {
                  type: 'section',
                  prevId: 'sectionA section',
                  pathId: 'Sw/BUTd8kDYNHCeGCdmzdA==',
                  props: {
                    label: 'Another section',
                  },
                },
                'buttonWoah!': {
                  type: 'button',
                  prevId: 'textAreastring2',
                  pathId: 'DEFAULTbuttonWoah!',
                  props: {
                    label: 'Woah!',
                  },
                },
                count: 12,
                'sectionA section': {
                  pathId: 'CB2r1SJ7nok8b514Bn4whw==',
                  props: {
                    label: 'A section',
                    open: true,
                  },
                  children: {
                    lastId: 'Y8miTTdDUibz9xrKivPr6g==',
                    'Y8miTTdDUibz9xrKivPr6g==': {
                      type: 'textInput',
                      pathId: 'c5e0hDcFQlr35Qd24QyeCQ==',
                      props: {
                        label: 'stuff inside section',
                        value: 'hello, world',
                      },
                    },
                    count: 1,
                  },
                  type: 'section',
                  open: true,
                },
                numberInputnumber: {
                  type: 'numberInput',
                  prevId: 'DMY1bkDr5VQ1PDd5OjQYiw==',
                  pathId: 'nkFHCZGdpD+imjvmXhuS1A==',
                  props: {
                    invalid: false,
                    invalidText: "Just kidding, you actually can't go above 50!",
                    label: 'number',
                    value: 50,
                  },
                },
                tabstabs1: {
                  prevId: 'sectionAnother section',
                  type: 'tabs',
                  props: {},
                  pathId: 'DEFAULTtabstabs1',
                  children: {
                    lastId: 'tabTab 2',
                    count: 2,
                    'tabTab 2': {
                      prevId: 'tabTab 1',
                      type: 'tab',
                      props: {
                        label: 'Tab 2',
                      },
                      pathId: 'gOSSKLUBS8fzEIMxGFatjA==',
                      children: {
                        '6pjZuv/Fe5b1baaHiR3iBg==': {
                          type: 'textInput',
                          pathId: 'khVweAX7DnLZZLLUEUWdng==',
                          props: {
                            label: 'stuff inside tab 2',
                            value: 'hello, world',
                          },
                        },
                        count: 1,
                        lastId: '6pjZuv/Fe5b1baaHiR3iBg==',
                      },
                    },
                    'tabTab 1': {
                      type: 'tab',
                      children: {
                        lastId: '5LmNPiEjwg0g9VFCUokVEQ==',
                        count: 1,
                        '5LmNPiEjwg0g9VFCUokVEQ==': {
                          type: 'textInput',
                          pathId: 'voUIBFnr5MnzFfvLh/jiVQ==',
                          props: {
                            label: 'stuff inside tab 1',
                            value: 'hello, world',
                          },
                        },
                      },
                      props: {
                        label: 'Tab 1',
                      },
                      pathId: 'ocpes3AdldHdH8ZqIAjTlA==',
                      lastReportedEventId: 1,
                    },
                  },
                },
              },
            },
          },
        }
      : {},
    visible: DEBUG_PREPOPULATED,
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
