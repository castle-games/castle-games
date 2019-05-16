import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';
import * as SVG from '~/components/primitives/svg';
import * as Utilities from '~/common/utilities';
import * as Bridge from '~/common/bridge';
import * as ExperimentalFeatures from '~/common/experimental-features';

import { css } from 'react-emotion';
import { Box, Button, RangeInput, Grommet } from 'grommet';

const theme = {
  global: {
    colors: {
      active: 'rgba(102,102,102,0.5)',
      background: '#020202',
      black: '#000000',
      brand: Constants.colors.brand2,
      control: {
        dark: Constants.colors.brand4,
        light: '#403216',
      },
      focus: Constants.colors.brand4,
      icon: {
        dark: '#f8f8f8',
        light: '#666666',
      },
      placeholder: '#AAAAAA',
      text: {
        dark: '#eeeeee',
        light: '#444444',
      },
      white: '#FFFFFF',
      'accent-1': Constants.colors.brand2,
      'accent-2': Constants.colors.brand1,
      'accent-3': Constants.colors.brand3,
      'accent-4': Constants.colors.brand4,
      'neutral-1': '#EB6060',
      'neutral-2': '#01C781',
      'neutral-3': '#6095EB',
      'neutral-4': '#FFB200',
      'status-critical': '#FF3333',
      'status-error': '#FF3333',
      'status-warning': '#F7E464',
      'status-ok': '#7DD892',
      'status-unknown': '#a8a8a8',
      'status-disabled': '#a8a8a8',
    },
    drop: {
      background: '#333333',
    },
    focus: {
      border: {
        color: [null, ';'],
        width: '2px',
      },
    },
    font: {
      family: Constants.font.mono,
    },
    input: {
      weight: 700,
    },
  },
  anchor: {
    color: 'control',
  },
  layer: {
    background: '#111111',
    overlay: {
      background: 'rgba(48,48,48,0.5)',
    },
  },
};

const STYLES_CONTAINER = css`
  width: 300px;
  background-color: ${theme.global.colors.background};
`;

export default class Tools extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <Grommet theme={theme}>
          <Box pad="small">
            <Button label="Default" onClick={() => {}} />
          </Box>
          <Box pad="small">
            <RangeInput />
          </Box>
        </Grommet>
      </div>
    );
  }
}
