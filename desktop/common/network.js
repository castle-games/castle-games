import * as Actions from '~/common/actions';

export const getProductData = async () => {
  let data;
  let featuredGames = [];
  let allContent = {};
  let viewer;
  let isOffline = true;

  try {
    data = await Actions.getInitialData();
  } catch (e) {
    console.log(e);
  }

  if (data) {
    isOffline = false;
    allContent.games = data.allGames ? data.allGames : [];
    allContent.users = data.allUsers ? data.allUsers : [];
    featuredGames = data.featuredGames ? data.featuredGames : [];
    viewer = data.me;
  }

  return { featuredGames, allContent, viewer, isOffline };
};
