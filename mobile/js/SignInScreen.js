import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';

import { apolloClient, gql, Mutation, initAsync } from './Conn';

const textInputStyle = {
  width: '100%',
  borderColor: '#ddd',
  borderRadius: 4,
  borderWidth: 1,
  padding: 4,
  margin: 4,
};

export default class SignInScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          padding: '25%',
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextInput style={textInputStyle} onChangeText={who => this.setState({ who })} />
        <TextInput
          style={textInputStyle}
          secureTextEntry
          textContentType="password"
          onChangeText={password => this.setState({ password })}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#ddd',
            borderRadius: 4,
            padding: 4,
            margin: 4,
            alignItems: 'center',
          }}
          onPress={this._onPressSignIn}>
          <Text>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _onPressSignIn = async () => {
    const { data: { userForLoginInput: { userId } } } = await apolloClient.query({
      query: gql`
        query($who: String!) {
          userForLoginInput(who: $who) {
            userId
          }
        }
      `,
      variables: { who: this.state.who },
    });
    console.log('got `userId`: ' + userId);

    const result = await apolloClient.mutate({
      mutation: gql`
        mutation($userId: ID!, $password: String!) {
          login(userId: $userId, password: $password) {
            userId
            token
          }
        }
      `,
      variables: { userId, password: this.state.password },
    });

    if (result && result.data && result.data.login && result.data.login.userId) {
      apolloClient.clearStore();
      await initAsync(result.data.login.token);
      setTimeout(() => this.props.navigation.navigate('GameScreen'), 200);
    }
  }
}
