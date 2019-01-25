import * as React from 'react';
import { css } from 'react-emotion';
import { isKeyHotkey } from 'is-hotkey';

import * as Actions from '~/common/actions';
import * as Browser from '~/common/browser';
import * as Constants from '~/common/constants';
import { History, HistoryContext } from '~/contexts/HistoryContext';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext } from '~/contexts/NavigationContext';
import * as NativeUtil from '~/native/nativeutil';
import * as Strings from '~/common/strings';

import ContentContainer from '~/components/ContentContainer.js';
import SocialContainer from '~/components/SocialContainer.js';

const isReloadHotkey = isKeyHotkey('mod+r');
const isFullscreenHotkey = isKeyHotkey('mod+f');

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
    this.state.navigation.navigateToHome = this.navigateToHome;
    this.state.navigation.navigateToMediaUrl = this.navigateToMediaUrl;
    this.state.navigation.navigateToMedia = this.navigateToMedia;
    this.state.navigation.navigateToCurrentUserProfile = this.navigateToCurrentUserProfile;
    this.state.navigation.navigateToUserProfile = this.navigateToUserProfile;
    this.state.navigation.navigateToHistory = this.navigateToHistory;
    this.state.currentUser.setCurrentUser = this.setCurrentUser;
    this.state.currentUser.clearCurrentUser = this.clearCurrentUser;
    this.state.currentUser.refreshCurrentUser = this.refreshCurrentUser;
    this.state.history = new History(props.storage);
  }

  componentDidMount() {
    window.addEventListener('nativeOpenUrl', this._handleNativeOpenUrlEvent);
    window.addEventListener('keydown', this._handleKeyDownEvent);
    window.addEventListener('CASTLE_SYSTEM_KEY_PRESSED', this._handleLuaSystemKeyDownEvent);

    NativeUtil.setBrowserReady(() => {});
  }
  
  componentWillUnmount() {
    window.removeEventListener('nativeOpenUrl', this._handleNativeOpenUrlEvent);
    window.removeEventListener('keydown', this._handleKeyDownEvent);
    window.removeEventListener('CASTLE_SYSTEM_KEY_PRESSED', this._handleLuaSystemKeyDownEvent);
  }

  // event listeners
  _handleNativeOpenUrlEvent = (e) => {
    this.navigateToMediaUrl(e.params.url);
  };

  _handleLuaSystemKeyDownEvent = async (e) => {
    await Actions.delay(50);
    this._handleKeyDownEvent({ ...e.params, preventDefault() {} });
  };

  _handleKeyDownEvent = (e) => {
    if (isReloadHotkey(e)) {
      return this.reload(e);
    }
    if (isFullscreenHotkey(e)) {
      (async () => {
        NativeUtil.setWindowFrameFullscreen(!(await NativeUtil.getWindowFrameFullscreen()));
      })();
      return;
    }
  };

  reload = async (e) => {
    if (e) {
      e.preventDefault();
    }
    await Actions.delay(100);
    console.log(`reload: navigating to ${this.state.navigation.media.mediaUrl}`);
    this.navigateToMediaUrl(this.state.navigation.media.mediaUrl);
  };

  // load media
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
  navigateToHome = () => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        contentMode: 'home',
      },
    });
  }

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
      this.refreshCurrentUser();
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

  navigateToHistory = () => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        contentMode: 'history',
      },
    });
  };

  // currentUser actions
  setCurrentUser = (user) => {
    this.setState({
      currentUser: {
        ...this.state.currentUser,
        user,
      },
    }, () => {
      if (user) {
        this.navigateToCurrentUserProfile();
      } else {
        this.navigateToHome();
      }
    });
  }

  clearCurrentUser = () => {
    if (!Actions.logout()) {
      return;
    }
    this.setState({
      currentUser: {
        ...this.state.currentUser,
        user: null,
      },
    }, () => {
      this.navigateToCurrentUserProfile();
    });
  }

  refreshCurrentUser = async () => {
    const viewer = await Actions.getViewer();
    if (!viewer) {
      return;
    }
    const updates = {
      currentUser: {
        ...this.state.currentUser,
        user: viewer,
      },
    };
    const userProfileShown = this.state.navigation.userProfileShown;
    if (viewer && userProfileShown && viewer.userId === userProfileShown.userId) {
      updates.navigation = {
        ...this.state.navigation,
        userProfileShown: viewer,
      };
    }
    this.setState(updates);
  }

  render() {
    return (
      <NavigationContext.Provider value={this.state.navigation}>
        <CurrentUserContext.Provider value={this.state.currentUser}>
          <HistoryContext.Provider value={this.state.history}>
            <div className={STYLES_CONTAINER}>
              <SocialContainer />
              <ContentContainer
                featuredMedia={this.state.featuredMedia}
              />
            </div>
            </HistoryContext.Provider>
        </CurrentUserContext.Provider>
      </NavigationContext.Provider>
    );
  }
};
