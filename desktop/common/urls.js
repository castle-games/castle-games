import * as url from 'url';

import ip from 'ip';

const isLua = (urlStr) => {
  return urlStr.endsWith('.lua');
};

const isOpenSource = (urlStr) => {
  let isOSS = false;
  try {
    const components = url.parse(urlStr);
    isOSS = components.hostname === 'raw.githubusercontent.com';
    // ... could do a better job here ...
  } catch (_) {}
  return isOSS;
};

const githubUserContentToRepoUrl = (urlStr) => {
  if (isOpenSource(urlStr)) {
    try {
      const matches = urlStr.match(
        /^(castle|https?):\/\/raw\.githubusercontent\.com\/([^/]*)\/([^/]*)\/([^/]*)/
      );
      if (matches) {
        return `https://github.com/${matches[2]}/${matches[3]}/tree/${matches[4]}`;
      }
    } catch (_) {}
  }
  return null;
};

const githubUserContentToArchiveUrl = (urlStr) => {
  if (isOpenSource(urlStr)) {
    try {
      const matches = urlStr.match(
        /^(castle|https?):\/\/raw\.githubusercontent\.com\/([^/]*)\/([^/]*)\/([^/]*)/
      );
      if (matches) {
        return `https://github.com/${matches[2]}/${matches[3]}/archive/${matches[4]}.zip`;
      }
    } catch (_) {}
  }
  return null;
};

const isPrivateUrl = (urlStr) => {
  // We would need to do a DNS lookup to be precise here
  // but we roughly approximate whether a URL is private
  // or not, by saying:
  // - Anything using the `file://` protocol is private
  // - `localhost` is private
  // - Any explicit IPv4 or IPv6 address in the private range is private
  // - Everything else is public (including URLs we don't understand)
  try {
    let components = url.parse(urlStr);
    return (
      components.protocol === 'file:' ||
      components.hostname === 'localhost' ||
      ip.isPrivate(components.hostname)
    );
  } catch (e) {
    // We can't parse the URL so we don't know what to do
    // We'll assume public
    return false;
  }
};

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
};

const isMetadataFileUrl = (urlStr) => {
  return urlStr && urlStr.endsWith('.castle');
};

/**
 *  Fetches the url and returns true if the response contains
 *  x-castle-content-type: .castle
 */
const doesUrlRespondWithCastleContentType = async (url) => {
  let result = false;
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('x-castle-content-type');
    if (contentType && contentType.contains('.castle')) {
      result = true;
    }
  } catch (_) {}
  return result;
};

/**
 *  @return { isUrl, isCastleUrl, type }
 *  isUrl is true if url.parse(urlStr) returned something.
 *  isCastleUrl is true if we think castle can open it.
 *  type can be 'game' or 'post'
 *  if type === post, result also includes `postId`
 */
const getCastleUrlInfo = (urlStr) => {
  let parsedUrl = url.parse(urlStr);
  let isCastleUrl = false,
    isUrl = false,
    type = null,
    data = {};
  if (parsedUrl) {
    if (parsedUrl.protocol) {
      isUrl = true;
    }
    if (parsedUrl.hostname === 'castle.games') {
      isUrl = true;
      if (parsedUrl.pathname.startsWith('/@') || parsedUrl.pathname.startsWith('/+')) {
        // published game
        isCastleUrl = true;
        type = 'game';
      } else if (parsedUrl.pathname.startsWith('/p/')) {
        // post
        isCastleUrl = true;
        type = 'post';
        const components = parsedUrl.pathname.split('/');
        if (components && components.length) {
          data.postId = components[components.length - 1];
        }
      }
    } else if (
      (parsedUrl.protocol &&
        (parsedUrl.protocol.startsWith('castle') || parsedUrl.protocol.startsWith('file'))) ||
      (parsedUrl.pathname &&
        (parsedUrl.pathname.endsWith('.castle') || parsedUrl.pathname.endsWith('.lua')))
    ) {
      // local or self-hosted project
      isCastleUrl = true;
      type = 'game';
    }
  }
  return { isUrl, isCastleUrl, type, ...data };
};

export {
  canonizeUserProvidedUrl,
  doesUrlRespondWithCastleContentType,
  getCastleUrlInfo,
  githubUserContentToRepoUrl,
  githubUserContentToArchiveUrl,
  isPrivateUrl,
  isLua,
  isOpenSource,
  isMetadataFileUrl,
};
