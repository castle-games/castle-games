import { Linking } from 'expo';
import React from 'React';
import GhostView from './GhostView';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { gql, Query, isSignedInAsync } from './Conn';
import { navigate } from './Navigation';

const DEFAULT_GAME_URI =
  'https://raw.githubusercontent.com/nikki93/procjam-oct-2018/69511b9ac7ec4631ec215a2dc8cd5b034cdd1b0d/main.lua';

let mountedInstance = null; // Ref to currently mounted `GameScreen` instance, if any

let linkingUri = null; // Last posted linking URI

// Consume posted linking URI
async function consumeUri() {
  if (linkingUri !== null) {
    if (mountedInstance) { // Currently mounted?
      mountedInstance.openUri(linkingUri);
      linkingUri = null;
    } else if ((await isSignedInAsync()) && navigate('GameScreen', { uri: linkingUri })) {
      linkingUri = null;
    }
    if (linkingUri) {
      setTimeout(consumeUri, 100); // Try again later
    }
  }
}

// Post linking URI when booted with initial URI
(async() => {
  const candidateUri = await Linking.getInitialURL();
  if (candidateUri && candidateUri !== 'castle://') {
    linkingUri = candidateUri;
    consumeUri();
  }
})();

// Post linking URI when foregrounded with URI
Linking.addEventListener('url', ({ url: candidateUri }) => {
  linkingUri = candidateUri;
  consumeUri();
});

const widgetStyle = {
  backgroundColor: 'white',
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#ddd',
};

export default class GameScreen extends React.Component {
  state = {
    viewedUri: null, // Uri that the `GhostView` should display
    editedUri: null, // Uri that the `TextInput` should display
    loadCounter: 0, // To force reloads of `GhostView`
  };

  constructor(props, context) {
    super(props, context);

    // Consume possible linking URI sources
    this.state.viewedUri = linkingUri || props.navigation.getParam('uri') || DEFAULT_GAME_URI;
    linkingUri = null;
    this.state.editedUri =  this.state.viewedUri;
  }

  componentDidMount() {
    mountedInstance = this;
  }

  componentWillUnmount() {
    mountedInstance = null;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              ...widgetStyle,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
            }}>
            <Query
              query={gql`
                query {
                  me {
                    username
                  }
                }
              `}>
              {({ loading, data }) =>
                loading ? <Text>...</Text> : <Text>{data.me.username}</Text>}
            </Query>
          </View>

          <TextInput
            style={{
              ...widgetStyle,
              flex: 1,
              borderColor: '#ddd',
              padding: 4,
            }}
            returnKeyType="go"
            value={this.state.editedUri}
            placeholder={'enter a castle uri here'}
            onChangeText={text => this.setState({ editedUri: text })}
            onSubmitEditing={() => this.openUri(this.state.editedUri)}
          />

          <TouchableOpacity
            style={{
              ...widgetStyle,
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: 1,
            }}
            onPress={() => this.setState(({ loadCounter }) => ({ loadCounter: loadCounter + 1 }))}>
            <FontAwesome name="refresh" size={16} color="black" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <GhostView
            key={this.state.loadCounter}
            style={{ backgroundColor: 'black', width: '100%', height: '100%' }}
            uri={this.state.viewedUri}
          />
        </View>
      </View>
    );
  }

  openUri(uri) {
    if (uri !== this.state.viewedUri) { // Don't restart game if already there
      this.setState(({ loadCounter }) => ({
        editedUri: uri,
        viewedUri: uri,
        loadCounter: loadCounter + 1,
      }))
    }
  }
}
