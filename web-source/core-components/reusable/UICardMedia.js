import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';
import UIInput from '~/core-components/reusable/UIInput';

import ContentEditor from '~/editor/ContentEditor';

const STYLES_CONTAINER = css`
  padding: 16px;
  background: ${Constants.brand.background};
  color: ${Constants.colors.black};
`;

const STYLES_CONTAINER_PREVIEW_LABEL = css`
  font-size: 10px;
  margin-bottom: 16px;
  font-weight: 600;
`;

const STYLES_CONTAINER_PREVIEW_NAME = css`
  font-size: 48px;
  font-weight: 700;
`;

const STYLES_BYLINE = css`
  margin-top: 8px;
  font-size: 10px;
  margin-bottom: 24px;
`;

const STYLES_SECTION = css`
  margin-top: 24px;
`;

const STYLES_SECTION_TITLE = css`
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 600;
  padding-bottom: 8px;
`;

const STYLES_SECTION_PARAGRAPH = css`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
`;

export default class UICardMedia extends React.Component {
  state = {
    email: '',
    message: '',
  };

  _handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleSubmit = async () => {
    await this.props.onRegisterMedia({ email: this.state.email, message: this.state.message });

    this.setState({ email: null, message: null });
  };

  render() {
    const name = this.props.media && this.props.media.name ? this.props.media.name : 'Untitled';
    const username =
      this.props.media && this.props.media.user ? this.props.media.user.username : 'Anonymous';
    const createdTime =
      this.props.media && this.props.media.published
        ? Strings.toDate(this.props.media.published)
        : Strings.toDate(this.props.media.createdTime);

    let rich =
      this.props.media && this.props.media.description && this.props.media.description.rich;
    if (rich) {
      rich = Strings.loadEditor(rich);
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTAINER_PREVIEW_NAME}>{name}</div>
        <div className={STYLES_BYLINE}>
          Created by {username} — {createdTime}
        </div>

        <div className={STYLES_SECTION}>
          {!rich ? (
            <div>
              <div className={STYLES_SECTION_TITLE}>Is this your game?</div>
              <div className={STYLES_SECTION_PARAGRAPH}>
                Castle lists all the games from a game jam, so people can browse and play them all
                easily. If you created this game and want to claim it, change the way it is
                presented, or remove it, please contact the Castle team and let us know.
              </div>
            </div>
          ) : (
            <div>
              <ContentEditor value={rich} readOnly />
            </div>
          )}

          <div style={{ marginTop: 48 }}>
            <UIInput
              value={this.state.email}
              label="E-mail"
              name="email"
              onChange={this._handleChange}
            />

            <UIInput
              value={this.state.message}
              label="message"
              name="message"
              onChange={this._handleChange}
              onSubmit={this._handleSubmit}
            />
          </div>

          <UIButtonIconHorizontal onClick={this._handleSubmit} icon={<SVG.Mail height="16px" />}>
            Contact us
          </UIButtonIconHorizontal>
        </div>
      </div>
    );
  }
}
