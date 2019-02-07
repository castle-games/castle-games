import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';
import ContentEditor from '~/editor/ContentEditor';

import UIAvatar from '~/components/reusable/UIAvatar';
import UIHeading from '~/components/reusable/UIHeading';
import UIUserStatusIndicator from '~/components/reusable/UIUserStatusIndicator';

const STYLES_CONTAINER = css`
  padding: 24px 16px 0 32px;
  background: ${Constants.colors.background4};
`;

const STYLES_BODY = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const STYLES_BODY_LEFT = css`
  min-width: 25%;
  color: ${Constants.colors.text};
`;

const STYLES_BODY_RIGHT = css`
  width: 25%
`;

const STYLES_TOP = css`
  display: flex;
`;

const STYLES_TITLE = css`
  font-size: 48px;
  line-height: 52px;
  font-weight: 400;
`;

const STYLES_META = css`
  margin: 4px 0 4px 0;
  font-size: ${Constants.typescale.lvl7};
  text-transform: uppercase;
  font-family: ${Constants.font.mono};
`;

const STYLES_ABOUT = css`
  line-height: 1.725;
  font-weight: 200;
  font-size: 16px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  padding: 0 24px 16px 16px;
`;

const STYLES_LINKS_ROW = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 16px;
`;

const STYLES_LINK_ITEM = css`
  color: ${Constants.colors.black};
  font-size: 14px;
  margin-right: 24px;
  cursor: pointer;
`;

const STYLES_LINK = css`
  color: ${Constants.colors.black};

  :hover {
    color: ${Constants.colors.selected};
  }
`;

const STYLES_CREATOR_IDENTITY = css`
  margin-bottom: 16px;
`;

export default class ProfileHeader extends React.Component {
  _handleClickCreatorLink = (url) => {
    NativeUtil.openExternalURL(url);
  };

  _renderTagline = (creator) => {
    let name = creator.username;
    let origin = `Joined on ${Strings.toDate(creator.createdTime)}`;

    let components = [];
    if (name) components.push(name);
    if (origin) components.push(origin);
    return components.join(' // ');
  };

  _renderLinks = (creator) => {
    let linkElements = [];
    const { websiteUrl, itchUsername, twitterUsername } = creator;

    // TODO: restore UserPlay / UserActivity
    /* let statusElement = (
      <UIUserStatusIndicator
        user={creator}
        onMediaSelect={this.props.onMediaSelect}
        hideIfNotRecent
      />
    );
    if (statusElement) {
      linkElements.push(
        (
        <div key="status" className={STYLES_LINK_ITEM}>
          {statusElement}
        </div>
        )
      );
    } */

    if (websiteUrl) {
      const { urlToDisplay, urlToOpen } = Urls.canonizeUserProvidedUrl(websiteUrl);
      linkElements.push(
        <div
          key="websiteUrl"
          className={STYLES_LINK_ITEM}
          onClick={() => this._handleClickCreatorLink(urlToOpen)}>
          <span className={STYLES_LINK}>{urlToDisplay}</span>
        </div>
      );
    }

    if (itchUsername) {
      linkElements.push(
        <div
          key="itchUsername"
          className={STYLES_LINK_ITEM}
          onClick={() => this._handleClickCreatorLink(`https://${itchUsername}.itch.io/`)}>
          <span className={STYLES_LINK}>{itchUsername}</span> on itch
        </div>
      );
    }

    if (twitterUsername) {
      linkElements.push(
        <div
          key="twitterUsername"
          className={STYLES_LINK_ITEM}
          onClick={() => this._handleClickCreatorLink(`https://twitter.com/${twitterUsername}/`)}>
          <span className={STYLES_LINK}>{twitterUsername}</span> on twitter
        </div>
      );
    }

    if (linkElements.length) {
      return <div className={STYLES_LINKS_ROW}>{linkElements}</div>;
    }
    return null;
  };

  render() {
    let aboutElement;
    if (this.props.creator && this.props.creator.about && this.props.creator.about.rich) {
      const richAbout = Strings.loadEditor(this.props.creator.about.rich);
      if (!Strings.isRichTextEmpty(richAbout)) {
        aboutElement = <ContentEditor readOnly value={richAbout} className={STYLES_ABOUT} />;
      }
    }
    const linksElement = this._renderLinks(this.props.creator);

    const avatarSrc =
      this.props.creator && this.props.creator.photo ? this.props.creator.photo.imgixUrl : null;

    const name = (this.props.creator && this.props.creator.name) ? this.props.creator.name : this.props.creator.username;
    
    return (
      <div className={STYLES_CONTAINER} onClick={this.props.onClick}>
        <div className={STYLES_BODY}>
          <div className={STYLES_BODY_LEFT}>
            <div className={STYLES_TOP}>
              <UIAvatar
                src={avatarSrc}
                style={{ width: 64, height: 64, marginRight: 24, marginTop: 6, borderRadius: 8 }}
              />
              <div className={STYLES_CREATOR_IDENTITY}>
                <UIHeading style={{ marginBottom: 8 }}>{name}</UIHeading>
                <div className={STYLES_META}>{this._renderTagline(this.props.creator)}</div>
              </div>
            </div>
            {linksElement}
          </div>
        </div>
      </div>
    );
  }
}
