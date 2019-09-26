import * as GhostEvents from './GhostEvents';

// Should coincide with channel names mentioned in 'base/main.lua'
GhostEvents.listen('GHOST_PRINT', params => console.log('[lua]', ...params));
GhostEvents.listen('GHOST_ERROR', ({ error, stacktrace }) => {
  console.log('[lua]', '[error]', `${error}\n${stacktrace}`);
});
