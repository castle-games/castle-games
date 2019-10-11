import { Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';

import * as Session from './Session';
import * as GameScreen from './GameScreen';

let rootNavigatorRef = null;

const navigateToRoute = ({ routeName, params }) => {
  if (rootNavigatorRef) {
    rootNavigatorRef.dispatch(NavigationActions.navigate({ routeName, params }));
  }
};

export const navigateToUri = uri => {
  if (!Session.isSignedIn()) {
    // If not signed in, go to the auth screen and tell it to navigate to this URI after
    navigateToRoute({
      routeName: 'AuthScreen',
      params: {
        uriAfter: uri,
      },
    });
  } else {
    // Game URI?
    {
      const [gameUri, sessionId] = uri.split('#');
      GameScreen.goToGame({ gameUri, extras: { sessionId } });
    }
  }
};

// If we get a URI but the root navigator isn't mounted yet, remember the URI and navigate later

let pendingUri = null;

const consumePendingUri = () => {
  if (pendingUri && rootNavigatorRef) {
    let uri = pendingUri;
    pendingUri = null;
    navigateToUri(uri);
  }
};

export const addPendingUri = uri => {
  pendingUri = uri;
  consumePendingUri();
};

export const setRootNavigatorRef = ref => {
  rootNavigatorRef = ref;
  consumePendingUri();
};

// Listen for `Linking` events and initial URI

Linking.addEventListener('url', ({ url }) => addPendingUri(url));

(async () => {
  const initialUri = await Linking.getInitialURL();
  if (initialUri) {
    addPendingUri(initialUri);
  }
})();
