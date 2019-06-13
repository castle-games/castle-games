import * as Actions from '~/common/actions';

export const getProductData = async () => {
  let data;
  let trendingGames = [];
  let gamesUnderConstruction = [];
  let newestGames = [];
  let randomGames = [];
  let featuredExamples = [];
  let recentChatMessages = [];
  let subscribedChatChannels = [];
  let allChatChannels = [];
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
    gamesUnderConstruction = data.gamesUnderConstruction ? data.gamesUnderConstruction : [];
    newestGames = data.newestGames ? data.newestGames : [];
    randomGames = data.randomGames ? data.randomGames : [];
    featuredExamples = data.featuredExamples ? data.featuredExamples : [];
    recentChatMessages = data.recentChatMessages ? data.recentChatMessages : [];
    subscribedChatChannels = data.subscribedChatChannels ? data.subscribedChatChannels : [];
    allChatChannels = data.allChatChannels ? data.allChatChannels : [];
    viewer = data.me;
  }

  return {
    trendingGames,
    gamesUnderConstruction,
    newestGames,
    randomGames,
    featuredExamples,
    viewer,
    isOffline,
    recentChatMessages,
    subscribedChatChannels,
    allChatChannels,
  };
};
