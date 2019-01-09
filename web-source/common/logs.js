import * as Urls from '~/common/urls';

const REMOTE_LOGS_POLL_INTERVAL_SEC = 5;
const DUMMY_REMOTE_LOGS = `{"id": 1967513926, "time": "Thu Dec 13 20:47:02 2018", "port": 22132, "logs": ["75ms","GET","https:\/\/raw.githubusercontent.com\/pkulchenko\/serpent\/522a6239f25997b101c585c0daf6a15b7e37fad9\/src\/serpent.lua"]}
{"id": 1365180540, "time": "Thu Dec 13 20:47:02 2018", "port": 22132, "logs": ["107ms","GET","https:\/\/raw.githubusercontent.com\/jesseruder\/triangle_warz\/b89e4045f8a2a36c760ce043e133a2903ac38e8a\/state.lua"]}`;
const DUMMY_REMOTE_ERROR = `{"id": 772995100, "time": "Sat Dec 15 18:30:12 2018", "port": 22128, "logs": {"error":"[string \"game\"]:737: attempt to index global 'player' (a nil value)","stacktrace":"[string \"game\"]:737: attempt to index global 'player' (a nil value)\nstack traceback:\n\t[string \"game\"]:737: in function 'update'\n\t[string \"object\"]:48: in function 'update_objects'\n\t[string \"game\"]:233: in function 'update_game'\n\t[string \"game\"]:123: in function '_update'\n\t[string \"server\"]:75: in function 'serverCb'\n\t[string \"cs\"]:363: in function <[string \"cs\"]:356>\n\t[C]: in function 'safeCall'\n\tportal.lua:342: in function 'update'\n\tmain.lua:77: in function <main.lua:71>\n\tmain.lua:234: in function 'update'\n\t[string \"boot.lua\"]:509: in function <[string \"boot.lua\"]:493>\n\t[C]: in function 'xpcall'\n\t[string \"boot.lua\"]:657: in function <[string \"boot.lua\"]:630>"}}`;

class Logs {
  _logs = null;
  _logId = 0;

  _remoteLogsUrl = null;
  _remoteLogsPollTimer = null;
  _lastRemoteLogIdSeen = 0;
  
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

  remote = (text, details) => {
    this._logs.push({
      type: 'remote',
      text,
      details,
      id: this._logId++,
    });
  };

  consume = () => {
    const result = [ ...this._logs ];
    this._logs = [];
    return result;
  };

  /** remote logs **/

  startPollingForRemoteLogs = (mediaUrl) => {
    // clear any existing state
    this.stopPollingForRemoteLogs();

    if (!Urls.isLocalUrl(mediaUrl)) {
      this._remoteLogsUrl = this._makeRemoteLogsUrl(mediaUrl);
      this._pollForRemoteLogsAsync();
    }
  };

  stopPollingForRemoteLogs = () => {
    if (this._remoteLogsUrl) {
      this._remoteLogsUrl = null;
    }
    if (this._remoteLogsPollTimer) {
      clearTimeout(this._remoteLogsPollTimer);
      this._remoteLogsPollTimer = null;
    }
    this._lastRemoteLogIdSeen = 0;
  };

  _pollForRemoteLogsAsync = async () => {
    let remoteLogsFetched = [];
    try {
      const response = await fetch(this._remoteLogsUrl);
      let responseText = await response.text(); // can sub DUMMY_REMOTE_LOGS here

      // response may contain a mixture of valid and invalid logs,
      // so guard each parse individually
      responseText.split(/\r?\n/).forEach(line => {
        let logObj;
        try {
          logObj = JSON.parse(line);
          if (logObj) {
            remoteLogsFetched.push(logObj);
          }
        } catch (_) {}
      });
    } catch (e) {
      // silently fail, try again next time
    }

    if (remoteLogsFetched && remoteLogsFetched.length) {
      // resume after last seen log id, or start from the beginning if not found
      for (let ii = 0; ii < remoteLogsFetched.length; ii++) {
        const log = remoteLogsFetched[ii];
        if (log.id && log.id === this._lastRemoteLogIdSeen)  {
          remoteLogsFetched = remoteLogsFetched.slice(ii + 1);
          break;
        }
      }

      // format and pipe through this.remote()
      remoteLogsFetched.forEach(log => {
        const { text, details } = this._formatLog(log);
        this.remote(text, details);
        this._lastRemoteLogIdSeen = log.id;
      });
    }
    this._remoteLogsPollTimer = setTimeout(
      this._pollForRemoteLogsAsync,
      REMOTE_LOGS_POLL_INTERVAL_SEC * 1000
    );
  };

  _makeRemoteLogsUrl = (mediaUrl) => {
    // we need to double encode because s3 is weird
    const encodedMediaUrl = encodeURIComponent(encodeURIComponent(mediaUrl));
    return `https://s3-us-west-2.amazonaws.com/castle-server-logs/logs-${encodedMediaUrl}`;
  }

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
