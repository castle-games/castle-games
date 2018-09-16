import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';

const STYLES_CONTAINER = css`
  padding: 0 0 88px 0;
`;

const STYLES_ROW_TITLE = css`
  font-weight: 400;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #222;
`;

const STYLES_ROW = css`
  font-weight: 400;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const STYLES_COLUMN = css`
  flex-shrink: 0;
  width: 180px;
  padding: 12px 16px 12px 16px;
`;

const STYLES_FLUID_COLUMN = css`
  min-width: 25%;
  width: 100%;
  padding: 12px 16px 12px 16px;
`;

export default class UIListMedia extends React.Component {
  render() {
    if (!this.props.media.length) {
      return (
        <UIEmptyState title="Nothing here, yet">
          When this user uploads media you will be able to see it here.
        </UIEmptyState>
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_ROW_TITLE}>
          <div className={STYLES_COLUMN}>Lorem Ipsum #1</div>
          <div className={STYLES_FLUID_COLUMN}>Lorem Ipsum #2</div>
          <div className={STYLES_COLUMN}>Lorem Ipsum #3</div>
          <div className={STYLES_COLUMN}>Lorem Ipsum #4</div>
          <div className={STYLES_COLUMN}>Lorem Ipsum #5</div>
          <div className={STYLES_COLUMN}>Lorem Ipsum #6</div>
        </div>
        {this.props.media.map((m, i) => {
          return (
            <div className={STYLES_ROW} key={`list-item-${i}`}>
              <div className={STYLES_COLUMN}>Name</div>
              <div className={STYLES_FLUID_COLUMN}>
                The purpose of design is to search for an essential quality in things. The subject
                of art is "I". The subject of design is "We".
              </div>
              <div className={STYLES_COLUMN}>1</div>
              <div className={STYLES_COLUMN}>2</div>
              <div className={STYLES_COLUMN}>3</div>
              <div className={STYLES_COLUMN}>4</div>
            </div>
          );
        })}
      </div>
    );
  }
}
