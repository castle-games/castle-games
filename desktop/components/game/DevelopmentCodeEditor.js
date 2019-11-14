import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { findDOMNode } from 'react-dom';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  display: flex;
`;

export default class DevelopmentCodeEditor extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER} ref={this._handleMonacoContainerRef}>
        <MonacoEditor
          ref={(ref) => (this._monacoEditorRef = ref)}
          width="100%"
          height="100%"
          language="lua"
          theme="vs-dark"
          options={{
            fontSize: 12,

            minimap: { enabled: false },

            scrollBeyondLastColumn: false,
            scrollBeyondLastLine: false,

            lineNumbers: 'on',
            glyphMargin: false,
            folding: false,
            lineNumbersMinChars: 3,
          }}
          value={this.props.value}
          onChange={this.props.onChange}
          editorWillMount={(monaco) => {
            monaco.languages.registerCompletionItemProvider('lua', {
              /*provideCompletionItems: async () => {
                while (
                  !(
                    this.state.lastSentEventId === null ||
                    this.props.element.lastReportedEventId == this.state.lastSentEventId
                  )
                ) {
                  await Actions.delay(40);
                }
                return {
                  suggestions: objectToArray(this.state.completions).map(
                    ({ label, insertText, documentation, kind, preselect, sortText }) => ({
                      label,
                      insertText: typeof insertText === 'string' ? insertText : label,
                      documentation,
                      kind: monaco.languages.CompletionItemKind[kind],
                      preselect,
                      sortText,
                    })
                  ),
                };
              },*/
            });
          }}
        />
      </div>
    );
  }

  _monacoContainerDOMNode = null;
  _monacoEditorRef = null;
  _resizeObserver = null;

  _handleMonacoContainerRef = (ref) => {
    // Unobserve previous
    if (this._monacoContainerDOMNode && this._resizeObserver) {
      this._resizeObserver.unobserve(this._monacoContainerDOMNode);
    }
    this._monacoContainerDOMNode = null;

    // Observe new
    if (ref) {
      this._monacoContainerDOMNode = findDOMNode(ref);

      if (!this._resizeObserver) {
        this._resizeObserver = new ResizeObserver((entries) => {
          if (this._monacoEditorRef) {
            this._monacoEditorRef.editor.layout();
          }
        });
      }

      this._resizeObserver.observe(this._monacoContainerDOMNode);
    }
  };
}
