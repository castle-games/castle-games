import * as React from 'react';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

const STYLES_ACTION = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  border: 1px solid #d6d6d6;
  color: #333;
`;

export default class ChatMessageActions extends React.Component {
  static defaultProps = {
    isEditable: false,
    onSelectEdit: () => {},
  };

  render() {
    const { isEditable } = this.props;
    let editElement;
    if (isEditable) {
      editElement = (
        <div className={STYLES_ACTION} onClick={this.props.onSelectEdit}>
          <SVG.Edit size="16" />
        </div>
      );
    }
    return <React.Fragment>{editElement}</React.Fragment>;
  }
}
