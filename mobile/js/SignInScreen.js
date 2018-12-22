import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';

import { ApolloConsumer, gql, Mutation } from './GraphQL';

const signInMutation = gql`
  mutation($who: String!, $password: String!) {
    login(who: $who, password: $password) {
      userId
    }
  }
`;

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
        <TextInput style={textInputStyle} onChangeText={password => this.setState({ password })} />
        <ApolloConsumer>
          {client => (
            <Mutation mutation={signInMutation}>
              {(signIn, { data }) => {
                if (data && data.login && data.login.userId) {
                  client.clearStore();
                  setTimeout(() => this.props.navigation.navigate('GameScreen'));
                }

                return (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#ddd',
                      borderRadius: 4,
                      padding: 4,
                      margin: 4,
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      signIn({
                        variables: {
                          who: this.state.who,
                          password: this.state.password,
                        },
                      })}>
                    <Text>Sign In</Text>
                  </TouchableOpacity>
                );
              }}
            </Mutation>
          )}
        </ApolloConsumer>
      </View>
    );
  }
}
