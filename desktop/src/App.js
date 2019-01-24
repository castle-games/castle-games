import * as React from 'react';
import { css } from 'react-emotion';

import * as Browser from '~/common/browser';
import * as Constants from '~/common/constants';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext } from '~/contexts/NavigationContext';
import * as Strings from '~/common/strings';

import ContentContainer from '~/components/ContentContainer.js';
import SocialContainer from '~/components/SocialContainer.js';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.background};
  height: 100vh;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  display: flex;
`;

export default class App extends React.Component {
  constructor(props) {
    super();

    this.state = props.state;
    this.state.navigation.navigateToMediaUrl = this.navigateToMediaUrl;
    this.state.navigation.navigateToMedia = this.navigateToMedia;
    this.state.navigation.navigateToCurrentUserProfile = this.navigateToCurrentUserProfile;
    this.state.navigation.navigateToUserProfile = this.navigateToUserProfile;
    // TODO: restore this._history = new History(props.storage);
  }

  _loadMediaAsync = async (media) => {
    let { mediaUrl, entryPoint } = media;
    if (!entryPoint) {
      // TODO: metadata: this should always be defined by this point
      entryPoint = mediaUrl;
    }
    if (Strings.isEmpty(mediaUrl)) {
      return;
    }
    this.setState({
      navigation: {
        ...this.state.navigation,
        contentMode: 'game',
        media,
        mediaUrl,
      },
    });
  };

  // navigation actions
  navigateToMediaUrl = async (mediaUrl) => {
    let media;
    try {
      media = await Browser.resolveMediaAtUrlAsync(mediaUrl);
    } catch (e) {
      // forward this error to the user
      // Logs.error(e.message);
    }

    if (media && media.mediaUrl) {
      this._loadMediaAsync(media);
    } else {
      // TODO: an error happened, surface it
    }
  };

  navigateToMedia = (media) => {
    if (!media || Strings.isEmpty(media.mediaUrl)) {
      return;
    }
    if (media.mediaId) {
      // this is a known media object, not an abstract url request
      this._loadMediaAsync(media);
    } else {
      // this is an incomplete media object, so try to resolve it before loading
      this.navigateToMediaUrl(media.mediaUrl);
    }
  };

  navigateToCurrentUserProfile = () => {
    if (this.state.currentUser.user) {
      this.navigateToUserProfile(this.state.currentUser.user);
    } else {
      // show sign in
      this.setState({
        navigation: ({
          ...this.state.navigation,
          contentMode: 'signin',
        }),
      });
    }
  };

  navigateToUserProfile = (user) => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        contentMode: 'profile',
        userProfileShown: user,
      },
    });
  };

  render() {
    return (
      <NavigationContext.Provider value={this.state.navigation}>
        <CurrentUserContext.Provider value={this.state.currentUser}>
          <div className={STYLES_CONTAINER}>
            <SocialContainer />
            <ContentContainer
              featuredMedia={this.state.featuredMedia}
            />
          </div>
        </CurrentUserContext.Provider>
      </NavigationContext.Provider>
    );
  }
};
