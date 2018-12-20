import * as GhostChannels from './GhostChannels';

// Should coincide with channel names mentioned in 'base/main.lua'
GhostChannels.on('PRINT', json => console.log('[lua]', ...JSON.parse(json)));
GhostChannels.on('ERROR', json => console.log('[lua]', '[error]', JSON.parse(json).error));