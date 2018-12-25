import * as GhostChannels from './GhostChannels';

// Should coincide with channel names mentioned in 'base/main.lua'
GhostChannels.on('PRINT', json => console.log('[lua]', ...JSON.parse(json)));
GhostChannels.on('ERROR', json => {
  const { error, stacktrace } = JSON.parse(json);
  console.log('[lua]', '[error]', `${error}\n${stacktrace}`);
});
