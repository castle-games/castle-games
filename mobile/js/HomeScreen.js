import React, { Fragment } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import FastImage from 'react-native-fast-image';

import * as GameScreen from './GameScreen';

export const GAME_CARD_FRAGMENT = gql`
  fragment GameCard on Game {
    gameId
    title
    owner {
      userId
      username
    }
    coverImage {
      fileId
      url
    }
  }
`;

export const GameCard = ({ game }) => {
  return (
    <TouchableOpacity
      style={{
        width: '50%',
        padding: 8,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
      }}
      delayPressIn={50}
      onPress={() => GameScreen.goToGame({ gameId: game.gameId })}>
      <View
        style={{
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: 'white',
          elevation: 1,
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
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 20,
              fontFamily: 'RTAliasGrotesk-Bold',
              marginBottom: 4,
              textAlign: 'center',
            }}>
            {game.title}
          </Text>
          <Text style={{ fontSize: 14, color: '#aaa', fontFamily: 'RTAliasGrotesk-Regular' }}>
            @{game.owner.username}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SectionHeaderText = ({ children }) => {
  return (
    <View style={{
      width: '100%',
      padding: 16,
      paddingTop: 32,
      alignItems: 'center',
    }}>
      <Text style={{
        fontFamily: 'RTAliasGrotesk-Regular',
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}>
        {children}
      </Text>
    </View>
  )
}

const HomeScreen = () => {
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(gql`
    query Games {
      trendingGames {
        gameId
        ...GameCard
      }
      allGames {
        gameId
        ...GameCard
      }
    }
    ${GAME_CARD_FRAGMENT}
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
      ) : !(queryData && (queryData.trendingGames || queryData.allGames)) ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>There was a problem with loading games.</Text>
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
                marginBottom: -16,
              }}
              placeholder="Paste a Castle game URL"
              returnKeyType="go"
              clearButtonMode="while-editing"
              onSubmitEditing={(e) => GameScreen.goToGame({ gameUri: e.nativeEvent.text })}
            />
          </View>
          <SectionHeaderText>Trending</SectionHeaderText>
          {queryData.trendingGames.map(game => (
            <GameCard game={game} key={game.gameId} />
          ))}
          <SectionHeaderText>What's New</SectionHeaderText>
          {queryData.allGames.map(game => (
            <GameCard game={game} key={game.gameId} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
