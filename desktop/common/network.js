import * as Actions from '~/common/actions';

export const getProductData = async () => {
  let data;
  let featuredGames = [];
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
    featuredGames = data.featuredGames ? data.featuredGames : [];
    featuredExamples = data.featuredExamples ? data.featuredExamples : [];
    viewer = data.me;
  }

  return { featuredGames, featuredExamples, viewer, isOffline };
};
