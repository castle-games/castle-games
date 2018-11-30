class Logs {
  _logs = null;
  _logId = 0;

  constructor() {
    this._logs = [];
  }

  print = (message) => {
    this._logs.push({
      type: 'print',
      text: message,
      id: this._logId++,
    });
  };

  error = (error, stacktrace) => {
    this._logs.push({
      type: 'error',
      text: error,
      stacktrace,
      id: this._logId++,
    });
  };

  consume = () => {
    const result = [ ...this._logs ];
    this._logs = [];
    return result;
  };
}

export default new Logs();
