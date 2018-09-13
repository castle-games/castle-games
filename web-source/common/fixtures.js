// NOTE(jim):
// - I would like to be able to HTTP request for this user with all of the entities.
// - upon calling add/remove/update methods, I would just destroy the old user object
//   in memory and replace the memory address with a new user object.

export const User = {
  id: 'd3df05e0-2286-45ed-b434-12c587e9c840',
  username: 'jesse',
  avatarUrl: `/static/avatar-jesse.jpg`,
  email: 'jesse@expo.io',
  social: null,
  settings: null,
  description: null,
  profileViews: 0,
  profileViewScore: 0,
  updatedAt: new Date(),
  createdAt: new Date(),
  favorites: [],
  history: [],
  playlists: [],
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
// Here are the shapes of all the schema I'm expecting in Postgres.

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
