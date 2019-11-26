import * as React from 'react';
import * as SVG from '~/components/primitives/svg';
import * as Utilities from '~/common/utilities';

import GameEditorTreeItem from '~/components/game/editor/GameEditorTreeItem';

export default class GameEditorFileTree extends React.Component {
  state = {
    expandedDirectories: {},
  };

  _buildFileTree = () => {
    const { game, editableFiles } = this.props;

    let root = {};
    const entryPoint = Utilities.getLuaEntryPoint(game);
    let baseUrl = entryPoint.substring(0, entryPoint.lastIndexOf('/') + 1);

    Object.keys(editableFiles).forEach((url) => {
      let filename = editableFiles[url].filename;
      if (filename.startsWith(baseUrl)) {
        filename = filename.substring(baseUrl.length);
      }

      if (filename.startsWith('./')) {
        filename = filename.substring(2);
      }

      if (filename.includes('://')) {
        root[filename] = {
          url,
        };
      } else {
        let currentDirectory = root;

        filename
          .split('/')
          .slice(0, -1)
          .forEach((directory) => {
            if (!currentDirectory[directory]) {
              currentDirectory[directory] = {};
            }

            currentDirectory = currentDirectory[directory];
          });

        currentDirectory[filename.split('/').slice(-1)] = {
          url,
        };
      }
    });

    let orderedRoot = this._sortDirectory(root, 0, '');
    return this._buildFileTreeComponents(orderedRoot, '');
  };

  _sortDirectory = (unordered, depth, directoryPath) => {
    let ordered = [];

    // directories go first
    Object.keys(unordered)
      .sort()
      .forEach((filename) => {
        if (!unordered[filename].url) {
          let newDirectoryPath = directoryPath + filename + '/';
          let directory = null;
          let isExpanded = !!this.state.expandedDirectories[newDirectoryPath];

          if (isExpanded) {
            directory = this._sortDirectory(unordered[filename], depth + 1, newDirectoryPath);
          }

          ordered.push({ depth, isExpanded, directoryName: filename, directory });
        }
      });

    // then files
    Object.keys(unordered)
      .sort()
      .forEach((filename) => {
        if (unordered[filename].url) {
          ordered.push({
            depth,
            filename,
            url: unordered[filename].url,
          });
        }
      });

    return ordered;
  };

  _buildFileTreeComponents = (directory, directoryPath) => {
    let result = [];

    directory.forEach((file) => {
      if (file.directoryName) {
        let newDirectoryPath = directoryPath + file.directoryName + '/';

        result.push(
          <GameEditorTreeItem
            key={`${file.directoryName}`}
            style={{ marginLeft: `${file.depth * 12}px` }}
            onClick={() => {
              let expandedDirectories = { ...this.state.expandedDirectories };
              if (expandedDirectories[newDirectoryPath]) {
                delete expandedDirectories[newDirectoryPath];
              } else {
                expandedDirectories[newDirectoryPath] = true;
              }

              this.setState({
                expandedDirectories,
              });
            }}>
            {file.isExpanded ? (
              <SVG.DirectoryExpanded width={7} height={7} style={{ paddingRight: 4 }} />
            ) : (
              <SVG.DirectoryCollapsed width={7} height={7} style={{ paddingRight: 4 }} />
            )}
            {file.directoryName}
          </GameEditorTreeItem>
        );

        if (file.directory) {
          result = [...result, ...this._buildFileTreeComponents(file.directory, newDirectoryPath)];
        }
      } else {
        result.push(
          <GameEditorTreeItem
            key={file.url}
            style={{ marginLeft: `${file.depth * 12}px` }}
            onClick={() => {
              this.props.openTab(
                `file:${file.url}`,
                file.url.substring(file.url.lastIndexOf('/') + 1)
              );
            }}>
            {file.filename}
          </GameEditorTreeItem>
        );
      }
    });

    return result;
  };

  render() {
    return <div>{this._buildFileTree()}</div>;
  }
}
