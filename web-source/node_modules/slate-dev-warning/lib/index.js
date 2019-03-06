'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable no-console */

/**
 * Is in development?
 *
 * @type {Boolean}
 */

var IS_DEV = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

/**
 * Has console?
 *
 * @type {Boolean}
 */

var HAS_CONSOLE = typeof console != 'undefined' && typeof console.log == 'function' && typeof console.warn == 'function' && typeof console.error == 'function';

/**
 * Log a `message` at `level`.
 *
 * @param {String} level
 * @param {String} message
 * @param {Any} ...args
 */

function log(level, message) {
  if (!IS_DEV) {
    return;
  }

  if (HAS_CONSOLE) {
    var _console;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (_console = console)[level].apply(_console, [message].concat(args));
  }
}

/**
 * Log an error `message`.
 *
 * @param {String} message
 * @param {Any} ...args
 */

function error(message) {
  if (HAS_CONSOLE) {
    var _console2;

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    (_console2 = console).error.apply(_console2, [message].concat(args));
  }
}

/**
 * Log a warning `message` in development only.
 *
 * @param {String} message
 * @param {Any} ...args
 */

function warn(message) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  log.apply(undefined, ['warn', 'Warning: ' + message].concat(args));
}

/**
 * Log a deprecation warning `message`, with helpful `version` number in
 * development only.
 *
 * @param {String} version
 * @param {String} message
 * @param {Any} ...args
 */

function deprecate(version, message) {
  for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }

  log.apply(undefined, ['warn', 'Deprecation (' + version + '): ' + message].concat(args));
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = {
  deprecate: deprecate,
  error: error,
  warn: warn
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJJU19ERVYiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJIQVNfQ09OU09MRSIsImNvbnNvbGUiLCJsb2ciLCJ3YXJuIiwiZXJyb3IiLCJsZXZlbCIsIm1lc3NhZ2UiLCJhcmdzIiwiZGVwcmVjYXRlIiwidmVyc2lvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsU0FDSixPQUFPQyxPQUFQLEtBQW1CLFdBQW5CLElBQ0FBLFFBQVFDLEdBRFIsSUFFQUQsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLFlBSDNCOztBQU1BOzs7Ozs7QUFNQSxJQUFNQyxjQUNKLE9BQU9DLE9BQVAsSUFBa0IsV0FBbEIsSUFDQSxPQUFPQSxRQUFRQyxHQUFmLElBQXNCLFVBRHRCLElBRUEsT0FBT0QsUUFBUUUsSUFBZixJQUF1QixVQUZ2QixJQUdBLE9BQU9GLFFBQVFHLEtBQWYsSUFBd0IsVUFKMUI7O0FBT0E7Ozs7Ozs7O0FBUUEsU0FBU0YsR0FBVCxDQUFhRyxLQUFiLEVBQW9CQyxPQUFwQixFQUFzQztBQUNwQyxNQUFJLENBQUNWLE1BQUwsRUFBYTtBQUNYO0FBQ0Q7O0FBRUQsTUFBSUksV0FBSixFQUFpQjtBQUFBOztBQUFBLHNDQUxhTyxJQUtiO0FBTGFBLFVBS2I7QUFBQTs7QUFDZix5QkFBUUYsS0FBUixtQkFBZUMsT0FBZixTQUEyQkMsSUFBM0I7QUFDRDtBQUNGOztBQUVEOzs7Ozs7O0FBUUEsU0FBU0gsS0FBVCxDQUFlRSxPQUFmLEVBQWlDO0FBQy9CLE1BQUlOLFdBQUosRUFBaUI7QUFBQTs7QUFBQSx1Q0FEUU8sSUFDUjtBQURRQSxVQUNSO0FBQUE7O0FBQ2YsMEJBQVFILEtBQVIsbUJBQWNFLE9BQWQsU0FBMEJDLElBQTFCO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7OztBQU9BLFNBQVNKLElBQVQsQ0FBY0csT0FBZCxFQUFnQztBQUFBLHFDQUFOQyxJQUFNO0FBQU5BLFFBQU07QUFBQTs7QUFDOUJMLHdCQUFJLE1BQUosZ0JBQXdCSSxPQUF4QixTQUFzQ0MsSUFBdEM7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0EsU0FBU0MsU0FBVCxDQUFtQkMsT0FBbkIsRUFBNEJILE9BQTVCLEVBQThDO0FBQUEscUNBQU5DLElBQU07QUFBTkEsUUFBTTtBQUFBOztBQUM1Q0wsd0JBQUksTUFBSixvQkFBNEJPLE9BQTVCLFdBQXlDSCxPQUF6QyxTQUF1REMsSUFBdkQ7QUFDRDs7QUFFRDs7Ozs7O2tCQU1lO0FBQ2JDLHNCQURhO0FBRWJKLGNBRmE7QUFHYkQ7QUFIYSxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG4vKipcbiAqIElzIGluIGRldmVsb3BtZW50P1xuICpcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5cbmNvbnN0IElTX0RFViA9IChcbiAgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmXG4gIHByb2Nlc3MuZW52ICYmXG4gIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbidcbilcblxuLyoqXG4gKiBIYXMgY29uc29sZT9cbiAqXG4gKiBAdHlwZSB7Qm9vbGVhbn1cbiAqL1xuXG5jb25zdCBIQVNfQ09OU09MRSA9IChcbiAgdHlwZW9mIGNvbnNvbGUgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgdHlwZW9mIGNvbnNvbGUubG9nID09ICdmdW5jdGlvbicgJiZcbiAgdHlwZW9mIGNvbnNvbGUud2FybiA9PSAnZnVuY3Rpb24nICYmXG4gIHR5cGVvZiBjb25zb2xlLmVycm9yID09ICdmdW5jdGlvbidcbilcblxuLyoqXG4gKiBMb2cgYSBgbWVzc2FnZWAgYXQgYGxldmVsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbGV2ZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gKiBAcGFyYW0ge0FueX0gLi4uYXJnc1xuICovXG5cbmZ1bmN0aW9uIGxvZyhsZXZlbCwgbWVzc2FnZSwgLi4uYXJncykge1xuICBpZiAoIUlTX0RFVikge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKEhBU19DT05TT0xFKSB7XG4gICAgY29uc29sZVtsZXZlbF0obWVzc2FnZSwgLi4uYXJncylcbiAgfVxufVxuXG4vKipcbiAqIExvZyBhbiBlcnJvciBgbWVzc2FnZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAqIEBwYXJhbSB7QW55fSAuLi5hcmdzXG4gKi9cblxuXG5mdW5jdGlvbiBlcnJvcihtZXNzYWdlLCAuLi5hcmdzKSB7XG4gIGlmIChIQVNfQ09OU09MRSkge1xuICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgLi4uYXJncylcbiAgfVxufVxuXG4vKipcbiAqIExvZyBhIHdhcm5pbmcgYG1lc3NhZ2VgIGluIGRldmVsb3BtZW50IG9ubHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAqIEBwYXJhbSB7QW55fSAuLi5hcmdzXG4gKi9cblxuZnVuY3Rpb24gd2FybihtZXNzYWdlLCAuLi5hcmdzKSB7XG4gIGxvZygnd2FybicsIGBXYXJuaW5nOiAke21lc3NhZ2V9YCwgLi4uYXJncylcbn1cblxuLyoqXG4gKiBMb2cgYSBkZXByZWNhdGlvbiB3YXJuaW5nIGBtZXNzYWdlYCwgd2l0aCBoZWxwZnVsIGB2ZXJzaW9uYCBudW1iZXIgaW5cbiAqIGRldmVsb3BtZW50IG9ubHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZlcnNpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gKiBAcGFyYW0ge0FueX0gLi4uYXJnc1xuICovXG5cbmZ1bmN0aW9uIGRlcHJlY2F0ZSh2ZXJzaW9uLCBtZXNzYWdlLCAuLi5hcmdzKSB7XG4gIGxvZygnd2FybicsIGBEZXByZWNhdGlvbiAoJHt2ZXJzaW9ufSk6ICR7bWVzc2FnZX1gLCAuLi5hcmdzKVxufVxuXG4vKipcbiAqIEV4cG9ydC5cbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0IGRlZmF1bHQge1xuICBkZXByZWNhdGUsXG4gIGVycm9yLFxuICB3YXJuLFxufVxuIl19