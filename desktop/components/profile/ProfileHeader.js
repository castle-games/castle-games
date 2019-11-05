import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Strings from '~/common/strings';
import * as SVG from '~/components/primitives/svg';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';

import ContentEditor from '~/editor/ContentEditor';
import UIAvatar from '~/components/reusable/UIAvatar';
import UIHeading from '~/components/reusable/UIHeading';
import UIUserStatus from '~/components/reusable/UIUserStatus';
import UIUserStatusIndicator from '~/components/reusable/UIUserStatusIndicator';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.white};
  padding: 24px 16px 0 24px;
`;

const STYLES_BODY = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const STYLES_BODY_LEFT = css`
  color: ${Constants.colors.text};
  min-width: 25%;
`;

const STYLES_BODY_RIGHT = css`
  width: 25%;
`;

const STYLES_TOP = css`
  display: flex;
  margin-bottom: 24px;
`;

const STYLES_TITLE = css`
  font-size: 48px;
  line-height: 52px;
  font-weight: 400;
`;

const STYLES_META = css`
  font-family: ${Constants.font.system};
  margin: 4px 0 4px 0;
  font-size: 12px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${Constants.colors.black};
  font-family: ${Constants.font.system};
  font-weight: 600;
  font-size: 12px;
  margin-right: 24px;
  cursor: pointer;

  span {
    margin-right: 0.3em;
  }

  :hover {
    span {
      text-decoration: underline;
    }
  }
`;

const STYLES_STATUS = css`
  margin-right: 8px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

const STYLES_CREATOR_IDENTITY = css`
  margin-bottom: 16px;
  padding-left: 24px;
`;

export default class ProfileHeader extends React.Component {
  _handleClickCreatorLink = (url) => {
    NativeUtil.openExternalURL(url);
  };

  _renderOnlineStatus = (creator) => {
    return (
      <div className={STYLES_STATUS}>
        <UIUserStatusIndicator user={creator} />
      </div>
    );
  };

  _handleSendMessage = () => {
    this.props.onSendMessage(this.props.creator);
  };

  _renderLinks = (creator, isOwnProfile, isAnonymousViewer) => {
    let linkElements = [];
    const { websiteUrl, itchUsername, twitterUsername } = creator;

    if (!isOwnProfile && !isAnonymousViewer) {
      linkElements.push(
        <div key="message" className={STYLES_LINK_ITEM} onClick={this._handleSendMessage}>
          <SVG.Mail style={{ width: 14, height: 14, marginRight: 4 }} />
          <span>Send Message</span>
        </div>
      );
    }

    if (websiteUrl) {
      const { urlToDisplay, urlToOpen } = Urls.canonizeUserProvidedUrl(websiteUrl);
      linkElements.push(
        <div
          key="websiteUrl"
          className={STYLES_LINK_ITEM}
          onClick={() => this._handleClickCreatorLink(urlToOpen)}>
          <span>{urlToDisplay}</span>
        </div>
      );
    }

    if (itchUsername) {
      linkElements.push(
        <div
          key="itchUsername"
          className={STYLES_LINK_ITEM}
          onClick={() => this._handleClickCreatorLink(`https://${itchUsername}.itch.io/`)}>
          <span>{itchUsername}</span> on itch
        </div>
      );
    }

    if (twitterUsername) {
      linkElements.push(
        <div
          key="twitterUsername"
          className={STYLES_LINK_ITEM}
          onClick={() => this._handleClickCreatorLink(`https://twitter.com/${twitterUsername}/`)}>
          <span>{twitterUsername}</span> on twitter
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
    const linksElement = this._renderLinks(
      this.props.creator,
      this.props.isOwnProfile,
      this.props.isAnonymousViewer
    );

    const avatarSrc =
      this.props.creator && this.props.creator.photo ? this.props.creator.photo.url : null;

    const name =
      this.props.creator && this.props.creator.name
        ? this.props.creator.name
        : this.props.creator.username;

    return (
      <div className={STYLES_CONTAINER} onClick={this.props.onClick}>
        <div className={STYLES_BODY}>
          <div className={STYLES_BODY_LEFT}>
            <div className={STYLES_TOP}>
              <UIAvatar src={avatarSrc} showIndicator={false} style={{ width: 90, height: 90 }} />
              <div className={STYLES_CREATOR_IDENTITY}>
                <UIHeading style={{ marginBottom: 8 }}>{name}</UIHeading>
                <div className={STYLES_META}>
                  {this._renderOnlineStatus(this.props.creator)}
                  <UIUserStatus
                    user={this.props.creator}
                    navigateToGame={this.props.navigateToGameMeta}
                  />
                </div>
              </div>
            </div>
            {linksElement}
          </div>
        </div>
      </div>
    );
  }
}
