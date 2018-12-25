import * as url from 'url';

const isLua = (urlStr) => {
  return urlStr.endsWith('.lua');
}

const isOpenSource = (urlStr) => {
  let isOSS = false;
  try {
    const components = url.parse(urlStr);
    isOSS = (
      components.hostname === 'raw.githubusercontent.com'
      // ... could do a better job here ...
    );
  } catch (_) {}
  return isOSS;
}

const githubUserContentToRepoUrl = (urlStr) => {
  if (isOpenSource(urlStr)) {
    try {
      const matches = urlStr.match(/^(castle|https?):\/\/raw\.githubusercontent\.com\/([^/]*)\/([^/]*)\/([^/]*)/);
      if (matches) {
        return `https://github.com/${matches[2]}/${matches[3]}/tree/${matches[4]}`;
      }
    } catch (_) {}
  }
  return null;
}

const isLocalUrl = (urlStr) => {
  let isLocal = false;
  try {
    const components = url.parse(urlStr);
    isLocal = (
      components.hostname === 'localhost' ||
      components.hostname === '0.0.0.0' ||
      components.hostname === '127.0.0.1' ||
      components.hostname.indexOf('192.168') != -1 ||
      components.protocol === 'file:'
    );
  } catch (_) {}
  return isLocal;
}

// return { urlToDisplay, urlToOpen }
//   urlToDisplay guarantees no scheme
//   urlToOpen guarantees some valid scheme
const canonizeUserProvidedUrl = (urlStr) => {
  let urlToDisplay, urlToOpen;
  try {
    const componentsToDisplay = url.parse(urlStr);
    const componentsToOpen = url.parse(urlStr);

    componentsToDisplay.protocol = '';
    urlToDisplay = url.format(componentsToDisplay);
    if (urlToDisplay.indexOf('//') === 0) {
      urlToDisplay = urlToDisplay.substring(2);
    }
    if (urlToDisplay.slice(-1) == '/') {
      urlToDisplay = urlToDisplay.substring(0, urlToDisplay.length - 1);
    }
    if (!componentsToOpen.protocol || componentsToOpen.protocol == '') {
      componentsToOpen.protocol = 'http:';
    }
    urlToOpen = url.format(componentsToOpen);
  } catch (_) {}
  return { urlToDisplay, urlToOpen };
}

export {
  canonizeUserProvidedUrl,
  githubUserContentToRepoUrl,
  isLocalUrl,
  isLua,
  isOpenSource,
}
