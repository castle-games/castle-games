import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';

import UICheckbox from '~/components/reusable/UICheckbox';

const STYLES_CONTAINER = css`
  color: ${Constants.colors.black};
  padding: 32px;
`;

const STYLES_HEADER = css`
  color: ${Constants.colors.text};
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl5};
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.base};
  line-height: ${Constants.linescale.base};
  margin-top: 16px;
`;

const STYLES_SECTION_TITLE = css`
  font-size: ${Constants.typescale.lvl6};
  font-family: ${Constants.font.heading};
  font-weight: 400;
  margin-top: 32px;
`;

const STYLES_ROW = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
`;

const STYLES_COLUMN_FLUID = css`
  min-width: 25%;
  width: 100%;
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.base};
  line-height: ${Constants.linescale.base};
`;

const STYLES_COLUMN = css`
  width: 88px;
  flex-shrink: 0;
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.base};
  line-height: ${Constants.linescale.base};
`;

const Row = (props) => {
  return (
    <div className={STYLES_ROW}>
      <span className={STYLES_COLUMN_FLUID}>{props.children}</span>
      <span className={STYLES_COLUMN}>{props.firstCol}</span>
      <span className={STYLES_COLUMN}>{props.secondCol}</span>
      <span className={STYLES_COLUMN}>{props.thirdCol}</span>
    </div>
  );
};

export default class ProfileSettings extends React.Component {
  render() {
    const { notifications } = this.props.user;

    return (
      <div className={STYLES_CONTAINER}>
        <h2 className={STYLES_HEADER}>Your notifications</h2>

        <p className={STYLES_PARAGRAPH}>Configure when you want to notified.</p>

        <h3 className={STYLES_SECTION_TITLE}>E-mail notifications</h3>

        <Row
          firstCol={<span>Every</span>}
          secondCol={<span>Daily</span>}
          thirdCol={<span>Never</span>}
        />

        {notifications.email.map((option) => {
          return (
            <Row
              key={`email-${option.type}`}
              firstCol={<UICheckbox value={option.frequency === 'every'} />}
              secondCol={<UICheckbox value={option.frequency === 'daily'} />}
              thirdCol={<UICheckbox value={option.frequency === 'never'} />}>
              {option.description}
            </Row>
          );
        })}

        <h3 className={STYLES_SECTION_TITLE}>Desktop notifications</h3>

        <Row
          firstCol={<span>Every</span>}
          secondCol={<span>Daily</span>}
          thirdCol={<span>Never</span>}
        />

        {notifications.desktop.map((option) => {
          return (
            <Row
              key={`desktop-${option.type}`}
              firstCol={<UICheckbox value={option.frequency === 'every'} />}
              secondCol={<UICheckbox value={option.frequency === 'daily'} />}
              thirdCol={<UICheckbox value={option.frequency === 'never'} />}>
              {option.description}
            </Row>
          );
        })}
      </div>
    );
  }
}
