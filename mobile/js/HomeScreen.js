import React, { Fragment } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import FastImage from 'react-native-fast-image';

import * as GameScreen from './GameScreen';
import * as Constants from './Constants';

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
    <View
      style={{
        borderRadius: 4,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      }}>
      <TouchableOpacity
        delayPressIn={50}
        onPress={() =>
          GameScreen.goToGame({
            gameId: game.gameId,
            extras: { actionKeyCode: game.actionKeyCode },
          })
        }>
        <FastImage
          style={{
            width: '100%',
            aspectRatio: 16 / 9,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
          source={{ uri: game.coverImage && game.coverImage.url }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View
          style={{
            padding: 12,
            paddingTop: 8,
            height: 88 - (Constants.iOS ? 14 : 0),
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
          {!Constants.iOS && (
            <Text style={{ fontSize: 14, color: '#aaa', fontFamily: 'RTAliasGrotesk-Regular' }}>
              @{game.owner.username}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const SectionHeaderText = ({ children }) => {
  return (
    <View
      style={{
        width: '100%',
        padding: 16,
        paddingTop: 32,
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontFamily: 'RTAliasGrotesk-Regular',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
        {children}
      </Text>
    </View>
  );
};

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
              onSubmitEditing={e => GameScreen.goToGame({ gameUri: e.nativeEvent.text })}
            />
          </View>
          <SectionHeaderText>Trending</SectionHeaderText>
          {queryData.trendingGames.map(game => (
            <View style={{ width: '50%', padding: 8 }} key={game.gameId}>
              <GameCard game={game} />
            </View>
          ))}
          <SectionHeaderText>What's New</SectionHeaderText>
          {queryData.allGames.map(game => (
            <View style={{ width: '50%', padding: 8 }} key={game.gameId}>
              <GameCard game={game} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const IOS_GAMES = [
  {
    gameId: 'bplemk',
    title: 'One Room Dungeon',
    owner: {
      userId: '40',
      username: 'trasevol-dog',
    },
    coverImage: {
      fileId: '16431',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/f6bad3a9f7a43176cc6d2900256ce274',
    },
    actionKeyCode: 'return: ⏎',
  },
  {
    gameId: 'qe71h3',
    title: 'he idle',
    owner: {
      userId: '408',
      username: 'borb',
    },
    coverImage: {
      fileId: '16398',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/0ac9ece45f300e7ed646921e220c875e',
    },
    actionKeyCode: 'z',
  },
  {
    gameId: 'xkzbn6',
    title: '🦷 Infiniteeth 🦷',
    owner: {
      userId: '66',
      username: 'liquidream',
    },
    coverImage: {
      fileId: '16393',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/4453764e57731cd7f0128078f27991eb',
    },
  },
  {
    gameId: '3pyvc3',
    title: 'Verticube',
    owner: {
      userId: '45',
      username: 'revillo',
    },
    coverImage: {
      fileId: '15920',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/7419fe8d974e8ca4533cdadeade8a6ec',
    },
    actionKeyCode: 'space: ␣',
  },
  {
    gameId: '6j1567',
    title: 'Untitled Dungeon',
    owner: {
      userId: '6',
      username: 'ben',
    },
    coverImage: {
      fileId: '16338',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/57f21565644ca1296333776498169b8f',
    },
    actionKeyCode: 'return: ⏎',
  },
  {
    gameId: '40',
    title: 'Cake Cat',
    owner: {
      userId: '101',
      username: 'platformalist',
    },
    coverImage: {
      fileId: '97',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/58d7a39c1ce7b837b884b6381d71b207',
    },
  },
];

const iOSHomeScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#f2f2f2',
    }}>
    <ScrollView
      contentContainerStyle={{
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
      {IOS_GAMES.map(game => (
        <View style={{ width: '50%', padding: 8 }} key={game.gameId}>
          <GameCard game={game} />
        </View>
      ))}
    </ScrollView>
  </View>
);

export default Constants.iOS ? iOSHomeScreen : HomeScreen;
