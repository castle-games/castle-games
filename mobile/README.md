# Set up

- Follow the [dependencies and development environment setup instructions](https://facebook.github.io/react-native/docs/getting-started) in the React Native documentation for your host platform (stop right before "Creating a new application").
- Run `npm i` in this directory

# Running

## iOS

- `npx react-native start` to start the packager
- Run Debug target on Simulator or device to automatically load dev bundle from the packager

## Android

- `npx react-native run-android`

Once you have the app running, shake the device to open the React Native developer menu and select 'Enable Live Reload'. Then, you should be able to modify any of the files under 'js/' and save to trigger a reload of the app that picks up your changes!