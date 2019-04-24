import Storage from '~/common/storage';

const storage = new Storage('experimental-features');

export function isEnabled(featureName) {
  const ret = storage.getItem(featureName) === 'yes';
  console.log(`ret is ${ret}`);
  return ret;
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
