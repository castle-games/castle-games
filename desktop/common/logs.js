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
      details: stacktrace,
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
    const result = [...this._logs];
    this._logs = [];
    return result;
  };

  _formatLog = (logObj) => {
    if (Array.isArray(logObj.logs)) {
      return {
        text: logObj.logs.join(' '),
      };
    } else if (logObj.logs.error) {
      return {
        text: logObj.logs.error,
        details: logObj.logs.stacktrace,
      };
    }
    return {};
  };
}

export default new Logs();
