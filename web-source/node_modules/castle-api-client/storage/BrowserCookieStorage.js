// Cookie Code from
// https://stackoverflow.com/questions/19189785/is-there-a-good-cookie-library-for-javascript

// Not recommended because now you have a cookie following you everywhere


function getCookie(sName) {
  sName = sName.toLowerCase();
  var oCrumbles = document.cookie.split(';');
  for (var i = 0; i < oCrumbles.length; i++) {
    var oPair = oCrumbles[i].split('=');
    var sKey = decodeURIComponent(oPair[0].trim().toLowerCase());
    var sValue = oPair.length > 1 ? oPair[1] : '';
    if (sKey == sName) return decodeURIComponent(sValue);
  }
  return '';
}

function setCookie(sName, sValue) {
  var oDate = new Date();
  oDate.setYear(oDate.getFullYear() + 1);
  var sCookie =
    encodeURIComponent(sName) +
    '=' +
    encodeURIComponent(sValue) +
    ';expires=' +
    oDate.toGMTString() +
    ';path=/';
  document.cookie = sCookie;
}

function clearCookie(sName) {
  setCookie(sName, '');
}

class BrowserCookieStorage {
  constructor(opts) {
    this._opts = Object.assign({}, opts);
    this._prefix = this._opts.prefix || 'arce-';
  }

  async setAsync(key, value) {
    setCookie(this._prefix + key, JSON.stringify(value));
  }

  async getAsync(key) {
    let rawValue = getCookie(this._prefix + key);
    if (!rawValue) {
      return undefined;
    }
    try {
      return JSON.parse(rawValue);
    } catch (e) {
      console.error('Failed to parse JSON for cookie `' + this._prefix + key + '`');
      return null;
    }
  }

  async deleteAsync(key) {
    clearCookie(this._prefix + key);
  }
}

module.exports = BrowserCookieStorage;
