import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text } from 'react-native';
import { ApolloProvider } from '@apollo/react-hooks';

import * as Session from './Session';
import MainSwitcher from './MainSwitcher';

// Initialize a `Session`
const useSession = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      await Session.initAsync();
      if (mounted) {
        setInitialized(true);
      }
    })();

    return () => (mounted = false);
  }, []);

  return { initialized };
};

const Main = () => {
  const sessionHook = useSession();

  // Session not yet initialized? Just show a loading screen...
  if (!sessionHook.initialized) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <ApolloProvider client={Session.apolloClient}>
        <MainSwitcher />
      </ApolloProvider>
    </View>
  );
};

export default Main;
