import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

const STYLES_BACK_FORWARD = css`
  display: flex;
  flex-shrink: 0;
  width: 32px;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  color: ${Constants.REFACTOR_COLORS.subdued};
`;

export default class UIBackForwardControl extends React.Component {
  static defaultProps = {
    history: {
      stack: [],
      index: 0,
    },
    onBack: () => {},
    onForward: () => {},
  };

  isBackAvailable = () => {
    const { index, stack } = this.props.history;
    return index < stack.length - 1;
  };

  isForwardAvailable = () => {
    return this.props.history.index > 0;
  };

  render() {
    let backStyles,
      forwardStyles,
      onBackClick = null,
      onForwardClick = null;
    if (this.isBackAvailable()) {
      backStyles = {
        cursor: 'pointer',
        color: 'black',
      };
      onBackClick = this.props.onBack;
    }
    if (this.isForwardAvailable()) {
      forwardStyles = {
        cursor: 'pointer',
        color: 'black',
      };
      onForwardClick = this.props.onForward;
    }
    return (
      <React.Fragment>
        <div className={STYLES_BACK_FORWARD} style={backStyles} onClick={onBackClick}>
          <SVG.ChevronLeft width={24} height={24} />
        </div>
        <div className={STYLES_BACK_FORWARD} style={forwardStyles} onClick={onForwardClick}>
          <SVG.ChevronRight width={24} height={24} />
        </div>
      </React.Fragment>
    );
  }
}
