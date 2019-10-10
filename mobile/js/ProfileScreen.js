import React, { Fragment } from 'react';
import { View, Text, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { GameCard } from './HomeScreen';

const ProfilePhoto = props => {
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(
    gql`
      query User($userId: ID!) {
        user(userId: $userId) {
          photo {
            url
          }
        }
      }
    `,
    { variables: { userId: props.userId } }
  );

  return (
    <View
      style={{
        backgroundColor: '#eee',
        borderRadius: 1000000,
        overflow: 'hidden',
      }}>
      {queryLoading ? (
        <Fragment />
      ) : (
        <FastImage
          style={{
            width: '100%',
            aspectRatio: 1,
          }}
          source={{ uri: queryData.user.photo.url }}
        />
      )}
    </View>
  );
};

const ProfileScreen = () => {
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(gql`
    query Me {
      me {
        userId
        name
        username
        gameItems {
          gameId
        }
      }
    }
  `);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f2f2f2',
      }}>
      {queryLoading ? (
        <Fragment />
      ) : (
        <View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#fff',
              shadowColor: 'black',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              elevation: 5,
            }}>
            <View style={{ width: 96, paddingVertical: 16 }}>
              <ProfilePhoto userId={queryData.me.userId} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{queryData.me.name}</Text>
              <Text>@{queryData.me.username}</Text>
              <Text style={{ paddingVertical: 16, fontWeight: 'bold' }}>Log Out</Text>
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{
              padding: 8,
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {queryData.me.gameItems.map(game => (
              <GameCard gameId={game.gameId} key={game.gameId} />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;
