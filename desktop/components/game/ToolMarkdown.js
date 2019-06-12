import * as React from 'react';

import { css } from 'react-emotion';
import { ToolsContext } from '~/components/game/Tools';

import ReactMarkdown from 'react-markdown';

const STYLES_MARKDOWN = css`
  font-size: 14px;

  margin-bottom: 14px;

  img {
    max-width: 100%;
  }

  a:visited {
    color: #ff00ff;
  }
  a:hover {
    color: #8f79d8;
  }
  a {
    color: #ff00ff;
    font-weight: 600;
    -webkit-transition: 200ms ease color;
    transition: 200ms ease color;
  }

  /* All of below based on https://github.com/sindresorhus/github-markdown-css/blob/gh-pages/github-markdown.css */

  details {
    display: block;
  }

  summary {
    display: list-item;
  }

  a {
  }

  a:active,
  a:hover {
    outline-width: 0;
  }

  strong {
    font-weight: inherit;
    font-weight: bolder;
  }

  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }

  img {
    border-style: none;
  }

  code,
  kbd,
  pre {
    font-family: monospace, monospace;
  }

  input {
    font: inherit;
    margin: 0;
  }

  input {
    overflow: visible;
  }

  [type='checkbox'] {
    box-sizing: border-box;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }

  input {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  strong {
    font-weight: 600;
  }

  hr:before {
    content: '';
    display: table;
  }

  hr:after {
    clear: both;
    content: '';
    display: table;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  td,
  th {
    padding: 0;
  }

  details summary {
    cursor: pointer;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 0;
    margin-top: 0;
  }

  h1 {
    font-size: 32px;
  }

  h1,
  h2 {
    font-weight: 600;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  h3,
  h4 {
    font-weight: 600;
  }

  h4 {
    font-size: 16px;
  }

  h5 {
    font-size: 14px;
  }

  h5,
  h6 {
    font-weight: 600;
  }

  h6 {
    font-size: 12px;
  }

  p {
    margin-bottom: 10px;
    margin-top: 0;
  }

  blockquote {
    margin: 0;
  }

  ol,
  ul {
    margin-bottom: 0;
    margin-top: 0;
    padding-left: 0;
  }

  ol ol,
  ul ol {
    list-style-type: lower-roman;
  }

  ol ol ol,
  ol ul ol,
  ul ol ol,
  ul ul ol {
    list-style-type: lower-alpha;
  }

  dd {
    margin-left: 0;
  }

  code,
  pre {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
    font-size: 12px;
  }

  pre {
    margin-bottom: 0;
    margin-top: 0;
  }

  input::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  > :first-child {
    margin-top: 0 !important;
  }

  > :last-child {
    margin-bottom: 0 !important;
  }

  a:not([href]) {
    text-decoration: none;
  }

  blockquote,
  dl,
  ol,
  p,
  pre,
  table,
  ul {
    margin-bottom: 16px;
    margin-top: 0;
  }

  hr {
    height: 0.25em;
    margin: 24px 0;
    padding: 0;
  }

  blockquote {
    border-left: 0.25em solid #dfe2e5;
    padding: 0 1em;
  }

  blockquote > :first-child {
    margin-top: 0;
  }

  blockquote > :last-child {
    margin-bottom: 0;
  }

  kbd {
    border: 1px solid #c6cbd1;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #959da5;
    display: inline-block;
    font-size: 11px;
    line-height: 10px;
    padding: 3px 5px;
    vertical-align: middle;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: 16px;
    margin-top: 24px;
  }

  h1 {
    font-size: 2em;
  }

  h1,
  h2 {
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.25em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.875em;
  }

  h6 {
    font-size: 0.85em;
  }

  ol,
  ul {
    padding-left: 2em;
  }

  ol ol,
  ol ul,
  ul ol,
  ul ul {
    margin-bottom: 0;
    margin-top: 0;
  }

  li {
    word-wrap: break-all;
  }

  li > p {
    margin-top: 16px;
  }

  li + li {
    margin-top: 0.25em;
  }

  dl {
    padding: 0;
  }

  dl dt {
    font-size: 1em;
    font-style: italic;
    font-weight: 600;
    margin-top: 16px;
    padding: 0;
  }

  dl dd {
    margin-bottom: 16px;
    padding: 0 16px;
  }

  table {
    display: block;
    overflow: auto;
    width: 100%;
  }

  table th {
    font-weight: 600;
  }

  table td,
  table th {
    border: 1px solid #dfe2e5;
    padding: 6px 13px;
  }

  table tr {
    border-top: 1px solid #c6cbd1;
  }

  table tr:nth-child(2n) {
  }

  img {
    box-sizing: content-box;
    max-width: 100%;
  }

  img[align='right'] {
    padding-left: 20px;
  }

  img[align='left'] {
    padding-right: 20px;
  }

  code {
    border-radius: 3px;
    font-size: 85%;
    margin: 0;
    padding: 0.2em 0.4em;
  }

  pre {
    word-wrap: normal;
  }

  pre > code {
    background: transparent;
    border: 0;
    font-size: 100%;
    margin: 0;
    padding: 0;
    white-space: pre;
    word-break: normal;
  }

  pre {
    border-radius: 3px;
    font-size: 85%;
    line-height: 1.45;
    overflow: auto;
    padding: 16px;
  }

  pre code {
    border: 0;
    display: inline;
    line-height: inherit;
    margin: 0;
    max-width: auto;
    overflow: visible;
    padding: 0;
    word-wrap: normal;
  }

  kbd {
    border: 1px solid #d1d5da;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #c6cbd1;
    display: inline-block;
    font: 11px SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
    line-height: 10px;
    padding: 3px 5px;
    vertical-align: middle;
  }
`;

export default class ToolMarkdown extends React.PureComponent {
  render() {
    const { element } = this.props;
    return (
      <div className={STYLES_MARKDOWN}>
        <ToolsContext.Consumer>
          {({ transformAssetUri }) => (
            <ReactMarkdown
              source={element.props && element.props.source}
              transformImageUri={transformAssetUri}
            />
          )}
        </ToolsContext.Consumer>
      </div>
    );
  }
}
