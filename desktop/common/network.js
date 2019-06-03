import * as Actions from '~/common/actions';

export const getProductData = async () => {
  let data;
  let featuredGames = [];
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
    console.log(data);
    isOffline = false;
    featuredGames = data.featuredGames ? data.featuredGames : [];
    featuredExamples = data.featuredExamples ? data.featuredExamples : [];
    recentChatMessages = data.recentChatMessages ? data.recentChatMessages : [];
    subscribedChatChannels = data.subscribedChatChannels ? data.subscribedChatChannels : [];
    allChatChannels = data.allChatChannels ? data.allChatChannels : [];
    viewer = data.me;
  }

  return {
    featuredGames,
    featuredExamples,
    viewer,
    isOffline,
    recentChatMessages,
    subscribedChatChannels,
    allChatChannels,
  };
};
