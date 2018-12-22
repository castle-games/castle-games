import React from 'React';
import GhostView from './GhostView';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { gql, Query } from './Conn';

const DEFAULT_GAME_URI =
  'https://raw.githubusercontent.com/nikki93/procjam-oct-2018/69511b9ac7ec4631ec215a2dc8cd5b034cdd1b0d/main.lua';

const widgetStyle = {
  backgroundColor: 'white',
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#ddd',
};

export default class GameScreen extends React.Component {
  state = {
    viewedUri: DEFAULT_GAME_URI,
    editedUri: null,
    loadCounter: 0,
  };

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
            onSubmitEditing={() =>
              this.setState(({ editedUri, loadCounter }) => ({
                viewedUri: editedUri,
                loadCounter: loadCounter + 1,
              }))}
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
}
