class Logs {
  _logs = null;
  _logId = 0;

  constructor() {
    this._logs = [];
  }

  print = (text) => {
    this._logs.push({
      type: 'print',
      text,
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

  system = (text) => {
    this._logs.push({
      type: 'system',
      text,
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
