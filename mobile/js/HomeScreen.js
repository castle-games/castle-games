import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
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
        backgroundColor: '#f2f2f2',
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
        <ScrollView
          contentContainerStyle={{
            padding: 8,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          <View style={{ width: '100%', padding: 8 }}>
            <TextInput
              style={{
                width: '100%',
                borderRadius: 4,
                backgroundColor: '#00000010',
                borderColor: '#ccc',
                borderWidth: 0,
                paddingVertical: 8,
                paddingHorizontal: 12,
                fontSize: 16,
              }}
              placeholder="Paste a Castle game URL"
            />
          </View>
          {queryData.allGames.map(game => (
            <TouchableOpacity
              key={game.gameId}
              style={{
                width: '50%',
                padding: 8,
                overflow: 'hidden',
              }}
              delayPressIn={50}
              onPress={() => GameScreen.goToGame({ gameId: game.gameId })}>
              <View
                style={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  shadowColor: 'black',
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  elevation: 5,
                }}>
                <FastImage
                  style={{
                    width: '100%',
                    aspectRatio: 16 / 9,
                  }}
                  source={{ uri: game.coverImage && game.coverImage.url }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <View
                  style={{
                    padding: 12,
                    paddingTop: 8,
                    backgroundColor: '#fff',
                    height: 88,
                  }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{game.title}</Text>
                  <Text style={{ fontSize: 14, color: '#aaa' }}>{game.owner.username}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
