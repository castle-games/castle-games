import throttle from 'lodash.throttle';

let logId = 1;

export const getLogs = () => {
  if (!window.cefQuery) {
    console.error('getLogs: window.cefQuery is undefined');
    return new Promise(resolve => resolve([]));
  }

  return new Promise(resolve => {
    window.cefQuery({
      request: JSON.stringify({
        type: 'READ_CHANNELS',
        body: { channelNames: ['PRINT', 'ERROR'] },
      }),
      onSuccess: json => {
        const channels = JSON.parse(json);

        const logs = [];
        channels.PRINT.map(json => {
          const params = JSON.parse(json);
          logs.push({ id: logId, type: 'print', text: `${params.join(' ')}` });
          logId = logId + 1;
        });

        channels.ERROR.map(json => {
          const error = JSON.parse(json).error;
          logs.push({ id: logId, type: 'error', text: `${error}` });
          logId = logId + 1;
        });
        return resolve(logs);
      },
    });
  });
};

export const setBrowserReady = callback => {
  if (!window.cefQuery) {
    console.error('setBrowserReady: window.cefQuery is undefined');
    return;
  }

  try {
    window.cefQuery({
      request: JSON.stringify({
        type: 'BROWSER_READY',
        body: {},
      }),
    });
  } catch (e) {
    alert('`cefQuery`: ' + e.message);
    return;
  }

  if (callback) {
    return callback();
  }
};

export const openWindowFrame = mediaUrl => {
  if (!window.cefQuery) {
    console.error('openWindowFrame: window.cefQuery is undefined');
    return;
  }

  try {
    window.cefQuery({
      request: JSON.stringify({
        type: 'OPEN_URI',
        body: {
          uri: mediaUrl,
        },
      }),
    });
  } catch (e) {
    alert('`cefQuery`: ' + e.message);
  }
};

export const openExternalURL = externalUrl => {
  if (!window.cefQuery) {
    console.error('openExternalUrl: window.cefQuery is undefined');
    return;
  }

  try {
    window.cefQuery({
      request: JSON.stringify({
        type: 'OPEN_EXTERNAL_URL',
        body: {
          url: externalUrl,
        },
      }),
    });
  } catch (e) {
    alert('`cefQuery`: ' + e.message);
  }
};

export const updateWindowFrame = rect => {
  if (!window.cefQuery) {
    console.error('updateWindowFrame: window.cefQuery is undefined');
    return;
  }

  try {
    window.cefQuery({
      request: JSON.stringify({
        type: 'SET_CHILD_WINDOW_FRAME',
        body: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      }),
    });
  } catch (e) {
    alert('`cefQuery`: ' + e.message);
  }
};

export const closeWindowFrame = () => {
  if (!window.cefQuery) {
    console.error('closeWindowFrame: window.cefQuery is undefined');
    return;
  }

  window.cefQuery({
    request: JSON.stringify({
      type: 'CLOSE',
      body: '',
    }),
  });
};
