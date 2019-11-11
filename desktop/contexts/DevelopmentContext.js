import * as React from 'react';

/**
 *  DevelopmentContext contains all of the "making game" state of the app.
 *  Only consume this if you need to re-render based on changes in development state.
 */
const DevelopmentContextDefaults = {
  isDeveloping: false,
  isMultiplayerCodeUploadEnabled: false,
  logs: [],
  editableFiles: {},
  editedFiles: {},
};

/**
 *  DevelopmentSetterContext contains only the setters which affect the value
 *  of DevelopmentContext.
 */
const DevelopmentSetterContextDefaults = {
  setIsDeveloping: (isDeveloping) => {},
  toggleIsDeveloping: () => {},
  setIsMultiplayerCodeUploadEnabled: (isEnabled) => {},
  addLogs: (logs) => {},
  clearLogs: () => {},
  setEditableFiles: () => {},
  editFile: () => {},
};

const DevelopmentContext = React.createContext({
  ...DevelopmentContextDefaults,
  setters: {
    ...DevelopmentSetterContextDefaults,
  },
});
const DevelopmentSetterContext = React.createContext(DevelopmentSetterContextDefaults);

class DevelopmentContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...DevelopmentContextDefaults,
      setters: {
        ...DevelopmentSetterContextDefaults,
        setIsDeveloping: this.setIsDeveloping,
        toggleIsDeveloping: this.toggleIsDeveloping,
        setIsMultiplayerCodeUploadEnabled: this.setIsMultiplayerCodeUploadEnabled,
        addLogs: this.addLogs,
        clearLogs: this.clearLogs,
        setEditableFiles: this.setEditableFiles,
        editFile: this.editFile,
      },
    };
  }

  // opts.onlyEnable: don't turn off development if it is already on
  setIsDeveloping = (isDeveloping, opts = {}) => {
    if (opts && opts.onlyEnable && this.state.isDeveloping) {
      return;
    }
    if (isDeveloping != this.state.isDeveloping) {
      this.setState(
        {
          isDeveloping,
          isMultiplayerCodeUploadEnabled: false, // always reset this
        },
        () => {
          const event = new Event('CASTLE_GAME_LAYOUT_UPDATE');
          document.dispatchEvent(event);
        }
      );
    }
  };

  toggleIsDeveloping = () => {
    this.setIsDeveloping(!this.state.isDeveloping);
  };

  setIsMultiplayerCodeUploadEnabled = (isMultiplayerCodeUploadEnabled) => {
    if (!this.state.isDeveloping && isMultiplayerCodeUploadEnabled) {
      throw new Error(`Cannot enable multiplayer code upload without enabling developer mode`);
    }
    this.setState({
      isMultiplayerCodeUploadEnabled,
    });
  };

  addLogs = (logs) => {
    this.setState({
      logs: [...this.state.logs, ...logs],
    });
  };

  clearLogs = () => {
    this.setState({
      logs: [],
    });
  };

  setEditableFiles = (files) => {
    this.setState({
      editableFiles: files,
    });
  };

  editFile = (url, file) => {
    this.setState({
      editableFiles: {
        ...this.state.editableFiles,
        [url]: file,
      },
      editedFiles: {
        ...this.state.editedFiles,
        [url]: file,
      },
    });
  };

  render() {
    return (
      <DevelopmentSetterContext.Provider value={this.state.setters}>
        <DevelopmentContext.Provider value={this.state}>
          {this.props.children}
        </DevelopmentContext.Provider>
      </DevelopmentSetterContext.Provider>
    );
  }
}

export { DevelopmentContext, DevelopmentSetterContext, DevelopmentContextProvider };
