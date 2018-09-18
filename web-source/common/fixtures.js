import * as Constants from '~/common/constants';

// Charlie's different fields
// https://github.com/expo/ghost-server/blob/master/server/schema.sql

export const SearchResults = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

export const User = {
  // NOTE(jim): No entities will just have a id field. Charlie's design will
  // have specifically a named id field. You must know what that is at query time.
  id: 'd3df05e0-2286-45ed-b434-12c587e9c840',
  userId: 'd3df05e0-2286-45ed-b434-12c587e9c840',
  username: 'jesse',
  avatarUrl: `static/avatar-jesse.jpg`,
  email: 'jesse@expo.io',
  social: null,
  settings: null,
  description: `A member of the castle-player team. I love creating next level experiences.`,
  profileViews: 0,
  profileViewScore: 0,
  updatedTime: new Date(),
  createdTime: new Date(),
  favorites: [],
  history: [],
  playlistItem: [],
  mediaItems: [PlaylistMedia, PlaylistMedia1, PlaylistMedia2, PlaylistMedia3],
  theme: {
    background: `#D20014`,
  },
};

const PlaylistMedia = {
  mediaId: 'example',
  name: 'DuckSoup Dungeon',
  description: null,
  dimensions: { width: '640px', height: '480px' },
  instructions: null,
  createdTime: new Date(),
  updatedTime: new Date(),
  url: `http://v6p9d9t4.ssl.hwcdn.net/html/655684/index.html`,
  userId: 'example-user-id-1',
  mediaId: 'example-playlist-id-0',
  engineId: 'example-engine-id-0',
  user: User,
};

const PlaylistMedia1 = {
  mediaId: 'example',
  name: 'Tilt',
  description: null,
  dimensions: null,
  instructions: null,
  createdTime: new Date(),
  updatedTime: new Date(),
  url: `http:////v6p9d9t4.ssl.hwcdn.net/html/1052612/index.html`,
  userId: 'example-user-id-1',
  mediaId: 'example-playlist-id-1',
  engineId: 'example-engine-id-1',
  user: User,
};

const PlaylistMedia2 = {
  mediaId: 'example',
  name: 'Rain',
  description: null,
  dimensions: { width: '560px', height: '560px' },
  instructions: null,
  createdTime: new Date(),
  updatedTime: new Date(),
  url: `http:////v6p9d9t4.ssl.hwcdn.net/html/539666/index.html`,
  userId: 'example-user-id-2',
  mediaId: 'example-playlist-id-2',
  engineId: 'example-engine-id-2',
  user: User,
};

const PlaylistMedia3 = {
  mediaId: 'example',
  name: 'Shrubnaut',
  description: null,
  dimensions: { width: '1280x', height: '720px' },
  instructions: null,
  createdTime: new Date(),
  updatedTime: new Date(),
  url: `http:////v6p9d9t4.ssl.hwcdn.net/html/802829/index.html`,
  userId: 'example-user-id-1',
  mediaId: 'example-playlist-id-4',
  engineId: 'example-engine-id-4',
  user: User,
};

export const CurrentPlaylist = {
  playlistId: 'example-playlist-id',
  userId: null,
  name: 'Bad Box Game Jam',
  description: null,
  mediaItems: [PlaylistMedia, PlaylistMedia1, PlaylistMedia2, PlaylistMedia3],
  updatedTime: new Date(),
  createdTime: new Date(),
};

export const Scores = [
  {
    id: 'af270ede-d819-4038-812f-1461c536b065',
    username: 'jesse',
    createdAt: new Date(),
    score: 100000,
  },
];
