import * as React from 'react';

import { Editor } from 'slate-react';

export default class EntityEntity extends React.Component {
  render() {
    return (
      <Editor
        ref={this.props.onAssignRefs}
        schema={this.props.schema}
        style={this.props.style}
        className={this.props.className}
        plugins={this.props.plugins}
        readOnly={this.props.readOnly}
        autoFocus={this.props.autoFocus}
        placeholder={this.props.placeholder}
        value={this.props.value}
        onChange={this.props.onChange}
        onPaste={this.props.onPaste}
        onFocus={(event, change) => change.focus()}
      />
    );
  }
}
