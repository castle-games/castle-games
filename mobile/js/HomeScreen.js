import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import FastImage from 'react-native-fast-image';

import * as GameScreen from './GameScreen';

const HomeScreen = () => {
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(gql`
    query Games {
      allGames {
        gameId
        title
        owner {
          username
        }
        coverImage {
          url
        }
      }
    }
  `);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      {queryLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      ) : !(queryData && queryData.allGames) ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Error fetching games!</Text>
        </View>
      ) : (
        <ScrollView style={{ paddingVertical: 32, paddingHorizontal: '15%' }}>
          {queryData.allGames.map(game => (
            <TouchableOpacity
              key={game.gameId}
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 6,
                marginBottom: 24,
                overflow: 'hidden',
              }}
              delayPressIn={50}
              onPress={() => GameScreen.goToGame({ game })}>
              <FastImage
                style={{ width: '100%', height: 180 }}
                source={{ uri: game.coverImage && game.coverImage.url }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={{ padding: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: '900' }}>{game.title}</Text>
                <Text style={{ fontSize: 14, color: '#aaa' }}>{game.owner.username}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
