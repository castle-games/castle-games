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
  mediaCount: 5,
  playListCount: 1,
  playlists: [],
  // TODO(jim): Enough to stub out placeholder
  media: [{}, {}, {}, {}, {}, {}, {}],
  theme: {
    background: `#D20014`,
  },
};

export const Scores = [
  {
    id: 'af270ede-d819-4038-812f-1461c536b065',
    username: 'jesse',
    createdAt: new Date(),
    score: 100000,
  },
];

// NOTE(jim):

/*

  NOTES

  jsonb                 required for rich text and groups of properties.
  uuidv4                my preferred uuid.
  decimal               trending score calculations often end up as decimal values.

*/

/*

  POSTGRES TABLE SPEC

  score {
    id:                 uuidv4,
    user:               <User>,
    createdAt:          date,
    score:              int
  }

  playlist {
    id:                 uuidv4
    name:               string
    description:        jsonb
    url:                string
    social:             jsonb
    settings:           jsonb
    createdAt:          date
    updatedAt:          date
    plays:              int
    plays_score:        decimal
    completions:        int
    completions_score:  decimal
    user:               <User>
    media:              list <Media>
  }

  media {
    id:                 uuidv4
    name:               string
    dimensions:         jsonb
    description:        jsonb
    instructions:       jsonb
    createdAt:          date
    updatedAt:          date
    plays:              int
    plays_score:        decimal
    completions:        int
    completions_score:  decimal
    playlists:          int,
    playlists_score:    decimal
    user:               <User>
    engine:             <Engine>
  }

  engine {
    id:                 uuidv4
    name:               string
    url:                string
    createdAt:          date
    updatedAt:          date
  }

*/
