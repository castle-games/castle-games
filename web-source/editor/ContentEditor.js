import * as React from 'react';

import EditorEntity from '~/editor/EditorEntity';

import hotkeys from '~/editor/plugins/hotkeys';
import paragraph from '~/editor/plugins/render-paragraph';
import marks from '~/editor/plugins/render-marks';

const plugins = [hotkeys(), paragraph(), marks()];

export default class ContentEditor extends React.Component {
  render() {
    return (
      <EditorEntity
        plugins={plugins}
        className={this.props.className}
        placeholder={this.props.placeholder}
        readOnly={this.props.readOnly}
        value={this.props.value}
        onChange={this.props.onChange}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
      />
    );
  }
}
