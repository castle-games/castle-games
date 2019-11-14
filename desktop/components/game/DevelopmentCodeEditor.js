import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  display: flex;
`;

export default class DevelopmentCodeEditor extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <MonacoEditor
          width="100%"
          height="100%"
          language="lua"
          theme="vs-dark"
          options={{
            fontSize: 12,

            minimap: { enabled: true },

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
}
