import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';
import * as SVG from '~/components/primitives/svg';
import * as Utilities from '~/common/utilities';
import * as Bridge from '~/common/bridge';
import * as ExperimentalFeatures from '~/common/experimental-features';

import { css } from 'react-emotion';
import { Box, Button, Grommet } from 'grommet';

const STYLES_CONTAINER = css`
  width: 300px;
  background-color: #ff0000;
`;

const theme = {
  global: {
    colors: {
      active: 'rgba(102,102,102,0.5)',
      background: '#111111',
      black: '#000000',
      brand: '#FD6FFF',
      control: {
        dark: '#FFCA58',
        light: '#403216',
      },
      focus: '#FFCA58',
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
      'accent-1': '#FD6FFF',
      'accent-2': '#60EB9F',
      'accent-3': '#60EBE1',
      'accent-4': '#FFCA58',
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
      family: 'Arial',
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

export default class Tools extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <Grommet theme={theme}>
          <Box align="center" pad="medium">
            <Button label="Default" onClick={() => {}} />
          </Box>
          <Box align="center" pad="medium">
            <Button label="Anchor" href="#" />
          </Box>
          <Box align="center" pad="medium">
            <Button disabled label="Disabled" onClick={() => {}} />
          </Box>
          <Box align="center" pad="medium">
            <Button primary label="Primary" onClick={() => {}} />
          </Box>
        </Grommet>
      </div>
    );
  }
}
