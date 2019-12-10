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
        overflow: 'hidden',
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
//
// Retrieved with the following query:
//   {
//     game(gameId: <GAME_ID>) {
//       gameId
//       title
//       owner {
//         userId
//         username
//         name
//         photo {
//           fileId
//           url
//         }
//       }
//       coverImage {
//         fileId
//         url
//       }
//       entryPoint
//       metadata
//       storageId
//       url
//       description
//       hostedFiles
//     }
//   }
const IOS_GAMES = [
  {
    seed: true,
    gameId: 'bplemk',
    actionKeyCode: 'return: ⏎',
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
  // {
  //   seed: true,
  //   gameId: 'qe71h3',
  //   actionKeyCode: 'z',
  //   title: 'he idle',
  //   owner: {
  //     userId: '408',
  //     username: 'borb',
  //     name: 'borb',
  //     photo: {
  //       fileId: '16314',
  //       url: 'https://d1vkcv80qw9qqp.cloudfront.net/ccc8e1c0e50c93d2459d47655f205023',
  //     },
  //   },
  //   coverImage: {
  //     fileId: '16398',
  //     url: 'https://d1vkcv80qw9qqp.cloudfront.net/0ac9ece45f300e7ed646921e220c875e',
  //   },
  //   entryPoint: 'http://api.castle.games/api/hosted/@borb/he-idle/masamainio.lua',
  //   metadata: {
  //     dimensions: 'full',
  //     primaryColor: 191028,
  //     main: 'masamainio.lua',
  //   },
  //   storageId: 'd8cb8abb-2f52-4433-bd08-86835eabe8e8',
  //   url: 'https://castle.games/+qe71h3/@borb/he-idle',
  //   description:
  //     'he run [arrow keys], he jump [Z key], he climb [arrow keys], he pause [enter], he die [backspace], he find secrets...?',
  //   hostedFiles: {
  //     'plr.lua': 'https://hosted.castle.games/44c251277021f718b8c654a54097769033ac3631',
  //     '.castleid': 'https://hosted.castle.games/5053402156f77d039c0e7c29cbade0927011dbc0',
  //     'level.lua': 'https://hosted.castle.games/a3956739e6a20a8c20620f9edcd50c9dbf4e4832',
  //     'he_idle.png': 'https://hosted.castle.games/03c41c58d8fdd3f42b1ef23d449e93dba74f092e',
  //     'libs/utf.lua': 'https://hosted.castle.games/6dae3013b44b212958fd07fef01c89bfe9c69ff1',
  //     'collision.lua': 'https://hosted.castle.games/c381ec3f478409ca200331d0538a81136088d46d',
  //     'libs/libs.lua': 'https://hosted.castle.games/421e84ce7d0fa529ae342080f18fbe68e81b6881',
  //     'libs/utf-8.lua': 'https://hosted.castle.games/64d4c26f07b24a28a8f2a4a214c9f37ec49d4897',
  //     'masamainio.lua': 'https://hosted.castle.games/cd17cf006a30be6d17db864237f31d5019aa7b9a',
  //     'sugarcoat/gfx.lua': 'https://hosted.castle.games/8a86abfc89ccb960fd24603c49e54322c4a713c6',
  //     'sugarcoat/map.lua': 'https://hosted.castle.games/da39a3ee5e6b4b0d3255bfef95601890afd80709',
  //     'borbs-space.castle': 'https://hosted.castle.games/8ce95fb0bff4d1af41393d23f544ec2c9e6a1f57',
  //     'sugarcoat/core.lua': 'https://hosted.castle.games/f198c4bba764c58b4354a7c89fa123a0ddc0cb25',
  //     'sugarcoat/text.lua': 'https://hosted.castle.games/2239899627689a6a8cdd101883a069252a971ecf',
  //     'sugarcoat/time.lua': 'https://hosted.castle.games/d0b74ceeaa0ccd41ec4e34e11181b2c5def7dce8',
  //     'swag/unscii-16.ttf': 'https://hosted.castle.games/47f73330db42f7380d30f561d63f40aea597ab43',
  //     'sugarcoat/audio.lua': 'https://hosted.castle.games/26902f42d075d2a70f3cf27f7a5cc2592c001da6',
  //     'sugarcoat/debug.lua': 'https://hosted.castle.games/eb34e39fc3bd09d0ae260b1071736b38139cc6b0',
  //     'sugarcoat/input.lua': 'https://hosted.castle.games/48ad826e5104ad3f426fe3cc376fc933f02e46e6',
  //     'sugarcoat/maths.lua': 'https://hosted.castle.games/5842fb29b47844c4a442e6c866faaf7594f2822a',
  //     'sugarcoat/sprite.lua':
  //       'https://hosted.castle.games/b5058e83d634f853319a92537f5ae5dbc99a7640',
  //     'sugarcoat/window.lua':
  //       'https://hosted.castle.games/d72f2757ac0b993e27c752bacf03e42b4090cd76',
  //     'sugarcoat/utility.lua':
  //       'https://hosted.castle.games/1f0fc33271a18a98b4e569c55961497bdd7ce5dd',
  //     'swag/unscii-8-thin.ttf':
  //       'https://hosted.castle.games/2fc5b8a00bf558bbe8435845268e41921278588b',
  //     'sugarcoat/TeapotPro.ttf':
  //       'https://hosted.castle.games/34a77fc3ecaa595d93b61bbb2d5c45d9f1bc7674',
  //     'sugarcoat/gfx_vault.lua':
  //       'https://hosted.castle.games/3cc7eea7081c5f6bb24286f9381464774624354b',
  //     'sugarcoat/sugarcoat.lua':
  //       'https://hosted.castle.games/b4330e1f55580a600bfca6e230bf6819c6722d08',
  //     'borbspace.sublime-project':
  //       'https://hosted.castle.games/ffc44b7b116b0bf622c1836efc22f2a65bd57f30',
  //     'sugarcoat/sugar_events.lua':
  //       'https://hosted.castle.games/ef6a81f5d193ef96f64885c97496f03e34f4dea8',
  //     'borbspace.sublime-workspace':
  //       'https://hosted.castle.games/90ed363a6d555cd0f5846c2474bddcf1e9165238',
  //   },
  // },
  {
    seed: true,
    gameId: 'xkzbn6',
    title: '🦷 Infiniteeth 🦷',
    owner: {
      userId: '66',
      username: 'liquidream',
      name: 'Paul Nicholas',
      photo: {
        fileId: '52',
        url: 'https://d1vkcv80qw9qqp.cloudfront.net/d833dac3ded044c79fc9e22263c5ec7b',
      },
    },
    coverImage: {
      fileId: '16393',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/4453764e57731cd7f0128078f27991eb',
    },
    entryPoint:
      'https://raw.githubusercontent.com/Liquidream/teeth-dodger/4096d89391443e69a02609df3a9a664cb1722b57/main.lua',
    metadata: {
      dimensions: 'full',
      primaryColor: 'ee2911',
      main: 'main.lua',
    },
    storageId: 'd23c17f3-6975-47fb-bdd1-cdff6e2baf86',
    url: 'https://castle.games/+xkzbn6/@liquidream/infiniteeth',
    description:
      "Escape being eaten by a monster's MANY layers of teeth. Use timing and positioning to avoid being squished!",
    hostedFiles: null,
  },
  {
    seed: true,
    gameId: '3pyvc3',
    actionKeyCode: 'space: ␣',
    title: 'Verticube',
    owner: {
      userId: '45',
      username: 'revillo',
      name: 'Oliver Castaneda',
      photo: {
        fileId: '15930',
        url: 'https://d1vkcv80qw9qqp.cloudfront.net/0605676a3093c7ba1eb8cd2927b55c5d',
      },
    },
    coverImage: {
      fileId: '15920',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/7419fe8d974e8ca4533cdadeade8a6ec',
    },
    entryPoint: 'http://api.castle.games/api/hosted/@revillo/verticube/main.lua',
    metadata: {
      main: 'main.lua',
    },
    storageId: '27ef29ba-91b2-428a-931b-035415e96d5d',
    url: 'https://castle.games/+3pyvc3/@revillo/verticube',
    description: 'Voxel platformer and level editor.',
    hostedFiles: {
      'main.lua': 'https://hosted.castle.games/3ad009f2e05a044c1e17d6a0033923fa7e106c75',
      '.castleid': 'https://hosted.castle.games/555e2b82ee243bf5c3af5ce61a384906491dea8c',
      'agent.lua': 'https://hosted.castle.games/683b4cf9e56d742ea031abadd6e8bc9c6d2e8672',
      'cover.png': 'https://hosted.castle.games/e3b651f9acbf779b9120feaef276efe4c4b0578b',
      'gfx3D.lua': 'https://hosted.castle.games/7385d24fa98d5b666e94f0a445e415f90c341a89',
      'items.lua': 'https://hosted.castle.games/da39a3ee5e6b4b0d3255bfef95601890afd80709',
      'tiles.png': 'https://hosted.castle.games/4201e0d81ffe592065eff6b1ce8c73b5e2406e9e',
      'voxel.lua': 'https://hosted.castle.games/fe095c38110bb061f0c3a8e88e8b6567fd5bbb30',
      'agents.png': 'https://hosted.castle.games/d8d66fcd8d4ce092f8b177456841bef43038e5be',
      'castle.png': 'https://hosted.castle.games/faae50e5eb789f84e0a9a8e1bc47a91735da6b14',
      'editor.lua': 'https://hosted.castle.games/c4cf03acc2c3206ae6e549f078efaf33d89e6c27',
      'tiles2.png': 'https://hosted.castle.games/340c50762163c4b4cb690f0cec8782c649646be0',
      'shaders.lua': 'https://hosted.castle.games/1f3fa9d4a49d8f575260711b1065234844111df9',
      'lib/list.lua': 'https://hosted.castle.games/4afab12617ed43e81476b6845ae6003bc81abab0',
      'ImageFont.png': 'https://hosted.castle.games/51dccebed6e781e6874ff41312b3bad666a31514',
      'audio/win.ogg': 'https://hosted.castle.games/67f783e34cb3ad1d5c23217acd0bb4c40ff5f9b1',
      'lib/sound.lua': 'https://hosted.castle.games/61eb6308d09395b37bf920c3339e05fc41b5b710',
      'mesh_util.lua': 'https://hosted.castle.games/75383adad2a90d2f4d6b6ce23607f3551193a616',
      'audio/jump.ogg': 'https://hosted.castle.games/b99a13ff59cc5155b799a443592d3b0229e030b1',
      'audio/land.ogg': 'https://hosted.castle.games/bdcc5787e5e49768d37e73c0d47d733945d20900',
      'audio/lava.ogg': 'https://hosted.castle.games/94394cb26fa41fc8ade06c9fdd746d88c6790627',
      'audio/swim.ogg': 'https://hosted.castle.games/d1ec11542d8bfa62e9762aa6efdc10bf67b8e288',
      'builder.castle': 'https://hosted.castle.games/c5ccbfd6284f6c1255a39704d8645dc0c92012a8',
      'audio/boing.ogg': 'https://hosted.castle.games/02d0893cbde6233a7a7fe93e4d1cb89b4867e50d',
      'audio/scream.ogg': 'https://hosted.castle.games/2430f99c85baa8b9c5288839fd35735ae277c83a',
      'audio/spring.ogg': 'https://hosted.castle.games/33cb9598d641f03a9c1a572eefa3f08b6e1c3167',
      'lib/cpml/init.lua': 'https://hosted.castle.games/74e521cb4d962e0617c2f515e9c0cca22bec59c3',
      'lib/cpml/README.md': 'https://hosted.castle.games/1c74befa99f48eabed484285d982690d37cd2103',
      'lib/cpml/LICENSE.md': 'https://hosted.castle.games/fa6c98ae9d667a9f99f965934874d2f300482870',
      'vsws.code-workspace': 'https://hosted.castle.games/a3d1eaef9261b75b7242a4089c5819110eaa8ba7',
      'levels/practice0.lua':
        'https://hosted.castle.games/aba59bb86e61980a3d9c8d0dbd8f6c51294812dc',
      'levels/practice1.lua':
        'https://hosted.castle.games/76a80b30910c2efa161bb350f738c7a94c769d05',
      'levels/practice2.lua':
        'https://hosted.castle.games/c1a0ae1adf2357acbd177d876f1a130e4ddaef3d',
      'lib/cpml/.travis.yml':
        'https://hosted.castle.games/9109a65c1d0fefa57cf03d5df04d03aa532793e8',
      'levels/intro_edit.lua':
        'https://hosted.castle.games/fe15aa50cbe5451a779bf0ef5e4606bd8def138f',
      'levels/intro_lava.lua':
        'https://hosted.castle.games/a7b0fe2b2711dc6db870ab68272f124ab89d2f3b',
      'levels/intro_guide.lua':
        'https://hosted.castle.games/60b8a6b7fc62e52ce95237528ba8238a6ea2fe62',
      'levels/intro_lava2.lua':
        'https://hosted.castle.games/80892d24c063e38418f31c3496df753dfbabc27c',
      'lib/cpml/.editorconfig':
        'https://hosted.castle.games/2793c7e33b0ba531fabd8c700e4db1ea564bf67a',
      'lib/cpml/doc/config.ld':
        'https://hosted.castle.games/9ad4b3eb325cfb044e45c203936d2050ece3f1bf',
      'levels/intro_castle.lua':
        'https://hosted.castle.games/70c99c75daded94797f97a570cf20c02f74f4fb2',
      'levels/intro_spring.lua':
        'https://hosted.castle.games/90814eb892a5d0059ab17319d1f2da563a98af8d',
      'lib/cpml/.coveralls.yml':
        'https://hosted.castle.games/60387f7581d863fd1acd8740a92492c4902926b4',
      'levels/intro_jumping.lua':
        'https://hosted.castle.games/69746f129c2d904687319364791eb7ec4975061b',
      'lib/cpml/modules/bvh.lua':
        'https://hosted.castle.games/b16d00d620f5a7ffdbf9c62e94609ce07b3a548f',
      'lib/cpml/modules/mat4.lua':
        'https://hosted.castle.games/ee6617cba6199b26e25a7b44e44d3e5786bea229',
      'lib/cpml/modules/mesh.lua':
        'https://hosted.castle.games/e08d8c9e0870de287ad5e318cc8c7ec7d4c95959',
      'lib/cpml/modules/quat.lua':
        'https://hosted.castle.games/7b975e46c9654f6c6456da11d8a31c5fd1524900',
      'lib/cpml/modules/vec2.lua':
        'https://hosted.castle.games/1de2074be950cc21d950646ff2b9ae8df1067ba5',
      'lib/cpml/modules/vec3.lua':
        'https://hosted.castle.games/01378c87c32c7a7307e8138403ee8f45288f4cb9',
      'lib/cpml/modules/color.lua':
        'https://hosted.castle.games/63441e6baae26c421aa912cec99c553c0b8afdba',
      'lib/cpml/modules/utils.lua':
        'https://hosted.castle.games/f92352695a8e5e9e72dabdd80ad7ba1d14cf0b68',
      'levels/practice1_backup.lua':
        'https://hosted.castle.games/65be982a468b5d50ded12470c71fd2708d01fd3e',
      'lib/cpml/modules/bound2.lua':
        'https://hosted.castle.games/b5fe5b88fd00ba0bee305b9e0b9237c4da27bc3d',
      'lib/cpml/modules/bound3.lua':
        'https://hosted.castle.games/da69d6ea0540cc7a17e51ea0ece6da4aa9d4507f',
      'lib/cpml/modules/octree.lua':
        'https://hosted.castle.games/4df8601e573bbb3046d25032c07bc1fabb7b0318',
      'lib/cpml/cpml-scm-1.rockspec':
        'https://hosted.castle.games/835abc806da0022b84ceefaf96d35d0561a3ddf1',
      'lib/cpml/modules/simplex.lua':
        'https://hosted.castle.games/461c26870fcf8b625eecd4d7d4a6f715a950a97b',
      'lib/cpml/modules/constants.lua':
        'https://hosted.castle.games/660ef03aba475cefa0d63dc04f83744354f87e10',
      'lib/cpml/modules/intersect.lua':
        'https://hosted.castle.games/0b876d13cfe9f1bec1ee98864f720f2a781fbba3',
    },
  },
  {
    seed: true,
    gameId: '6j1567',
    actionKeyCode: 'return: ⏎',
    title: 'Untitled Dungeon',
    owner: {
      userId: '6',
      username: 'ben',
      name: 'Ben',
      photo: {
        fileId: '2',
        url: 'https://d1vkcv80qw9qqp.cloudfront.net/aad41bcc8b1b2cebeac14d33ab4bb141',
      },
    },
    coverImage: {
      fileId: '16338',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/57f21565644ca1296333776498169b8f',
    },
    entryPoint:
      'https://raw.githubusercontent.com/terribleben/castle-halloween-party/e3166fa833a75970c1d227625a67a0ef33c2558b/main.lua',
    metadata: {
      scaling: 'step',
      dimensions: '256x192',
      primaryColor: 0,
      main: 'main.lua',
    },
    storageId: '309455a5-e086-460c-bdd5-eb7d6dd1186b',
    url: 'https://castle.games/+6j1567/@ben/untitled-dungeon',
    description: 'A dark dungeon, an ancient mystery, and some pumpkins.',
    hostedFiles: null,
  },
  {
    seed: true,
    gameId: '40',
    title: 'Cake Cat',
    owner: {
      userId: '101',
      username: 'platformalist',
      name: 'Andrew Reist',
      photo: {
        fileId: '98',
        url: 'https://d1vkcv80qw9qqp.cloudfront.net/95ce4970ef63e3cfadcaa1067ebd840c',
      },
    },
    coverImage: {
      fileId: '97',
      url: 'https://d1vkcv80qw9qqp.cloudfront.net/58d7a39c1ce7b837b884b6381d71b207',
    },
    entryPoint:
      'https://raw.githubusercontent.com/platformalist/love/996eed713963dd78de11ccb3839ff82b1e1db1bb/cake_cat/main.lua',
    metadata: {
      primaryColor: 'e6b8c1',
      main: 'main.lua',
    },
    storageId: '65f58eeb-d427-4a47-9b14-7f971ece02d4',
    url: 'https://castle.games/+40/@platformalist/cake-cat',
    description: 'Be a cat! Eat cake! Avoid donuts!',
    hostedFiles: null,
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
