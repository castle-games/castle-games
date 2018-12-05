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
      const pattern = /raw\.githubusercontent\.com\/[\w\-]+\/[\w\-]+\//g;
      const matches = urlStr.match(pattern);
      if (matches && matches.length) {
        const components = matches[0].split('/');
        const githubOwner = components[1];
        const githubRepo = components[2];
        return `https://github.com/${githubOwner}/${githubRepo}/`;
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
