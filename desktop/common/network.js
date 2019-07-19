import * as Actions from '~/common/actions';

export const getProductData = async () => {
  let data;
  let trendingGames = [];
  let featuredExamples = [];
  let viewer;
  let isOffline = true;

  try {
    data = await Actions.getInitialData();
  } catch (e) {
    console.log(`Issue fetching initial Castle data: ${e}`);
  }

  if (data) {
    isOffline = false;
    trendingGames = data.trendingGames ? data.trendingGames : [];
    featuredExamples = data.featuredExamples ? data.featuredExamples : [];
    viewer = data.me;
  }

  return {
    trendingGames,
    featuredExamples,
    viewer,
    isOffline,
  };
};
