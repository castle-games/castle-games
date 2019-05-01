import Storage from '~/common/storage';

const storage = new Storage('experimental-features');

export function isEnabled(featureName) {
  return storage.getItem(featureName) === 'yes';
}

export function setEnabled(featureName, isEnabled) {
  if (isEnabled) {
    storage.setItem(featureName, 'yes');
    console.log('set to yes');
  } else {
    storage.removeItem(featureName);
    console.log('set to no');
  }
  return;
}
