const url = require('url');

const isLua = (urlStr) => {
  return urlStr.endsWith('.lua');
}

const isLocalUrl = (urlStr) => {
  const components = url.parse(urlStr);
  return (
    components.hostname === 'localhost' ||
    components.hostname === '0.0.0.0' ||
    components.hostname === '127.0.0.1' ||
    components.hostname.indexOf('192.168') != -1
  );
}

export {
  isLocalUrl,
  isLua,
}
