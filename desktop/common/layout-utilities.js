const states = {
  1: 'FLUID_CONTENT',
  2: 'FLUID_CHAT',
};

export const getLayoutMode = (mode) => {
  if (mode === 'game') {
    return states[1];
  }

  if (mode === 'create') {
    return states[1];
  }

  if (mode === 'profile') {
    return states[1];
  }

  if (mode === 'notifications') {
    return states[1];
  }

  if (mode === 'edit_post') {
    return states[1];
  }

  if (mode === 'signin') {
    return states[1];
  }

  return states[2];
};
