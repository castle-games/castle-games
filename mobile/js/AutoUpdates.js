import { Updates } from 'expo';
import { Alert } from 'react-native';

if (!__DEV__) {
  let prompted = false;
  let interval;
  const check = async () => {
    if (!prompted) {
      if ((await Updates.checkForUpdateAsync()).isAvailable) {
        prompted = true;
        clearInterval(interval);

        const fetching = Updates.fetchUpdateAsync();
        Alert.alert(
          'Update Available',
          'Would you like to restart to use the latest version of Castle?',
          [
            {
              text: 'No',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                await fetching;
                Updates.reloadFromCache();
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  };
  interval = setInterval(check, 5000);
  setTimeout(check, 80);
}
