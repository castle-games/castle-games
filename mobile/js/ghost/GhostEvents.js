import * as GhostChannels from './GhostChannels';

const listenerLists = {}; // `eventName` -> `listenerId` -> `handler`

let nextListenerId = 1;

setInterval(async () => {
  (await GhostChannels.popAllAsync('LUA_TO_JS_EVENTS')).forEach(eventJson => {
    const { name, params } = JSON.parse(eventJson);

    const listenerList = listenerLists[name];
    if (listenerList) {
      Object.values(listenerList).forEach(handler => handler(params));
    }
  });
});

export const listen = (name, handler) => {
  let listenerList = listenerLists[name];
  if (!listenerList) {
    listenerList = {};
    listenerLists[name] = listenerList;
  }

  const listenerId = nextListenerId++;
  listenerList[listenerId] = handler;

  return {
    remove() {
      delete listenerList[listenerId];
    },
  };
};

export const sendAsync = async (name, params) => {
  await GhostChannels.pushAsync('JS_EVENTS', JSON.stringify({ name, params }));
};

export const clearAsync = async () => {
  await GhostChannels.clearAsync('JS_EVENTS');
  await GhostChannels.clearAsync('LUA_JS_EVENTS');
};
