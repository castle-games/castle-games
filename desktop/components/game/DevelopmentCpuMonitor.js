import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: inline-flex;
  font-family: ${Constants.font.mono};
  flex-shrink: 0;
  user-select: none;
  text-transform: uppercase;
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.linescale.lvl6};
  letter-spacing: 0.1px;
  font-weight: 600;
  padding: 0 4px 0 4px;
`;

export default class DevelopmentCpuMonitor extends React.Component {
  state = {
    cpuUsage: null,
  };

  componentDidMount() {
    this._mounted = true;
    NativeUtil.setCpuMonitoring(true);
    window.addEventListener('nativeCpuUsage', this._handleCpuUsageEvent);
  }

  componentWillUnmount() {
    NativeUtil.setCpuMonitoring(false);
    window.removeEventListener('nativeCpuUsage', this._handleCpuUsageEvent);
    this._mounted = false;
  }

  _handleCpuUsageEvent = ({ params }) => {
    if (!this._mounted) return;
    let cpuUsage = 0;
    if (params.usage) {
      params.usage.forEach((usage) => {
        cpuUsage += usage;
      });
      cpuUsage /= params.usage.length;
    }
    this.setState({ cpuUsage });
  };

  _getDisplayInfo = (cpuUsage) => {
    let text,
      color,
      backgroundColor = Constants.colors.black;
    if (isNaN(parseFloat(cpuUsage)) || cpuUsage < 0) {
      text = 'N/A';
      color = Constants.REFACTOR_COLORS.subdued;
    } else {
      const percent = Math.round(cpuUsage * 100);
      text = `${percent}%`;
      if (percent < 35) {
        color = Constants.colors.white;
      } else if (percent < 80) {
        color = Constants.colors.black;
        backgroundColor = Constants.brand.yellow;
      } else {
        color = Constants.colors.white;
        backgroundColor = 'red';
      }
    }
    return { text, color, backgroundColor };
  };

  render() {
    const { cpuUsage } = this.state;
    const { text, color, backgroundColor } = this._getDisplayInfo(cpuUsage);
    return (
      <div className={STYLES_CONTAINER} style={{ color, backgroundColor }}>
        {text}
      </div>
    );
  }
}
