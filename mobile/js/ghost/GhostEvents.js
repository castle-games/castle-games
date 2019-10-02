import { useState, useEffect, useRef } from 'react';

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

// Clear Lua <-> JS events channels for a new game
export const useClear = () => {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await clearAsync();
      if (mounted) {
        setCleared(true);
      }
    })();
    return () => (mounted = false);
  }, []);

  return { cleared };
};

// Listen for an event while respecting component lifecycle
export const useListen = ({ eventsReady, eventName, handler }) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (eventsReady) {
      let mounted = true;
      const handle = listen(eventName, params => {
        if (mounted) {
          savedHandler.current(params);
        }
      });
      return () => {
        mounted = false;
        handle.remove();
      };
    }
  }, [eventsReady, eventName]);
};
