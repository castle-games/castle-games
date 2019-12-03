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
            extras: {
              actionKeyCode: game.actionKeyCode,
              seed: game.seed ? game : null,
            },
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

// 'Seeded' data for embedded games on iOS
const IOS_GAMES = [
  {
    seed: true,
    gameId: 'bplemk',
    title: 'One Room Dungeon',
    owner: {
      userId: '40',
      username: 'trasevol-dog',
      name: 'Rémy 🍬',
      photo: {
        fileId: '3473',
        url: 'https://d1vkcv80qw9qqp.cloudfront.net/f5e3e2274911e04ad0cff1eb8c6af81e',
      },
    },
    coverImage: {
      fileId: '16431',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/f6bad3a9f7a43176cc6d2900256ce274',
    },
    entryPoint: 'http://api.castle.games/api/hosted/@trasevol-dog/one-room-dungeon/main.lua',
    metadata: {
      dimensions: 'full',
      primaryColor: null,
      main: 'main.lua',
    },
    storageId: '52b4f6a1-6780-440e-b00e-35c886380803',
    url: 'https://castle.games/+bplemk/@trasevol-dog/one-room-dungeon',
    description:
      'Explore a mysterious and exciting dungeon filled with exciting dangers without ever leaving the same room!',
    hostedFiles: {
      'game.lua': 'https://hosted.castle.games/73986567c12f05ffa0b32eea53c3b40b319899a9',
      'main.lua': 'https://hosted.castle.games/a3e42d1b707c0589aabb66200b83fb31ecd1e26e',
      '.castleid': 'https://hosted.castle.games/97fafe2799733de0773d78029fddd3bdfab3f8ab',
      'pico8.ttf': 'https://hosted.castle.games/bc5c51831971eb5364a275d7e07391673b6574e5',
      'sheet.png': 'https://hosted.castle.games/a5e9f7b494e4b5464819ac3c1d21ff84e8aa34c6',
      'ORD.castle': 'https://hosted.castle.games/2ec3ffc58e86d9a8ca91c710951761584423e54d',
      'audio/5.wav': 'https://hosted.castle.games/288655ab38c2d43d62031f693265a7e008115a5c',
      'audio/6.wav': 'https://hosted.castle.games/af4dd78f1e73f1a03e17a57f4545c7e90bfd3305',
      'audio/7.wav': 'https://hosted.castle.games/99447232497325e96a8192696d69c4f000bfdb09',
      'audio/8.wav': 'https://hosted.castle.games/430772d242dd4fd5bdbd374e5cfbbc714668ff3b',
      'audio/9.wav': 'https://hosted.castle.games/2ba3764ce6f70d71794c3f2217b7fc7d06e11f85',
      'preview.png': 'https://hosted.castle.games/57fd13d5d09192bb1f376af7bbcbebeab903c680',
      'audio/10.wav': 'https://hosted.castle.games/e642f43ba64c640e28ce7bc09bff4246ff45abde',
      'audio/11.wav': 'https://hosted.castle.games/f42e107fc9fed45ebb80a6e36834b6f518f72255',
      'audio/12.wav': 'https://hosted.castle.games/e8d9a57aae80ddf627bf8ec09a9bdd98c7f72554',
      'audio/13.wav': 'https://hosted.castle.games/8e05ce2cea8594436351864ad2229ba22f6048c5',
      'audio/14.wav': 'https://hosted.castle.games/8c9fdec34278a69a0da9865ce4630d5ca347e384',
      'audio/15.wav': 'https://hosted.castle.games/35be14570a5de419288d5fe89100dd892ab710b5',
      'audio/16.wav': 'https://hosted.castle.games/bab613bb141f2a94a199c50b8f397f5ecad5e2b4',
      'audio/17.wav': 'https://hosted.castle.games/bd500e13742962e81d2a25746c2a57acf39e905c',
      'audio/18.wav': 'https://hosted.castle.games/4c7451d4ebc809116d8c5e6bcfb7c7fe8bb8f09b',
      'audio/19.wav': 'https://hosted.castle.games/9669fa351845dd871f17ccd606a6adfaaa962595',
      'audio/25.wav': 'https://hosted.castle.games/5e9a8f1b48166fc05fbc8beea8a94259d4de8f5f',
      'audio/boss.wav': 'https://hosted.castle.games/4def1296019194a8561b9b5fe92b3142add84d26',
      'audio/calm.wav': 'https://hosted.castle.games/228f6d192f64bb2a49296d22322b958f4c0aa0ec',
      'audio/title.wav': 'https://hosted.castle.games/ba578e3c934d33af8070ecc34036d8cbb8b6c731',
      'audio/zone1.wav': 'https://hosted.castle.games/4e7e3438bf0abd99619a294728d5ba4460807642',
      'audio/zone2.wav': 'https://hosted.castle.games/b55c7dce6c63412749f6575f4c163580a864714b',
      'audio/zone3.wav': 'https://hosted.castle.games/92c58e5b7021119d9cad67d2cb92b0dc47b44c8b',
      'sugarcoat/gfx.lua': 'https://hosted.castle.games/abfdd96da65dceb7b743390238fc32767c6e959c',
      'sugarcoat/map.lua': 'https://hosted.castle.games/da39a3ee5e6b4b0d3255bfef95601890afd80709',
      'audio/gameover.wav': 'https://hosted.castle.games/bb342a99a939a4ac491312577becc535ffd47ca3',
      'sugarcoat/core.lua': 'https://hosted.castle.games/802df6c975383986b29d7a2af0ff8f4c94b518a0',
      'sugarcoat/text.lua': 'https://hosted.castle.games/cfae2370d8f7e868fdff495fe34b97f9622cf311',
      'sugarcoat/time.lua': 'https://hosted.castle.games/f6b3dd1d8bb484575245649b8ec424f9383076f5',
      'sugarcoat/audio.lua': 'https://hosted.castle.games/d61af6147657abc599ff3fe83e3c961623a30d0f',
      'sugarcoat/debug.lua': 'https://hosted.castle.games/e74d6ee0bc209ad17f4a07b22113b46bf269141a',
      'sugarcoat/input.lua': 'https://hosted.castle.games/6bca90589ee26ddf048f8213f18b946ddf581635',
      'sugarcoat/maths.lua': 'https://hosted.castle.games/72460ade70d4e0bc843e03373a445e8b6b0246b2',
      'sugarcoat/sprite.lua':
        'https://hosted.castle.games/8abcc1c5ce824bda90424ab615b627c0b235fe17',
      'sugarcoat/window.lua':
        'https://hosted.castle.games/471c2030c2ad151f16a03e58478930546856702d',
      'audio/title_intro.wav':
        'https://hosted.castle.games/11d68123c949771efcadd7f5f28454a4584b4973',
      'sugarcoat/utility.lua':
        'https://hosted.castle.games/9c3056f7430e68e87e5cf8c06169b28b206899df',
      'sugarcoat/TeapotPro.ttf':
        'https://hosted.castle.games/34a77fc3ecaa595d93b61bbb2d5c45d9f1bc7674',
      'sugarcoat/gfx_vault.lua':
        'https://hosted.castle.games/49dae298ac9da9919483ecb275e01bcc97c25f40',
      'sugarcoat/sugarcoat.lua':
        'https://hosted.castle.games/1b1270f75f38d9783805d71b73113271af287a2b',
      'sugarcoat/sugar_events.lua':
        'https://hosted.castle.games/986fcdb85ef374f235f71b462628db631ad50563',
    },
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
