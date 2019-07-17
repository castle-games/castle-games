import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import ProjectTemplateChooser from '~/components/create/ProjectTemplateChooser';
import UserStatus from '~/common/userstatus';

const DOCS_LINKS = [
  {
    title: 'Castle Docs Index',
    url: `${Constants.WEB_HOST}/documentation`,
    description: 'Read all our tutorials and examples.',
  },
  {
    title: 'Make Your First Game',
    url: `${Constants.WEB_HOST}/posts/@castle/make-your-first-castle-game`,
    description: `Learn Castle's basic workflow.`,
  },
  {
    title: 'Add a Game to your Profile',
    url: `${Constants.WEB_HOST}/posts/@castle/adding-game-to-castle-profile`,
    description: 'Get a url and a profile card for your game.',
  },
  {
    title: 'Update your Castle File',
    url: `${Constants.WEB_HOST}/posts/@castle/describe-your-game-with-castle-file`,
    description: 'Change the title and artwork for your game.',
  },
];

const STYLES_SECTION = css`
  margin-bottom: 16px;
`;

const STYLES_DOCUMENTATION = css``;

const STYLES_DOCS_LINKS = css`
  display: flex;
  flex-wrap: wrap;
`;

const STYLES_SECTION_TITLE = css`
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl4};
  font-weight: 400;
  margin-bottom: 12px;
`;

const STYLES_RECENT_PROJECTS = css`
  display: flex;
  flex-wrap: wrap;
`;

const STYLES_LINK_CARD = css`
  margin-right: 16px;
  margin-bottom: 16px;
  padding: 8px 16px 16px 16px;
  background: ${Constants.colors.white};
  width: ${Constants.card.width};
  cursor: pointer;
  border-radius: ${Constants.card.radius};
  border: 1px solid #ececec;

  :hover {
    color: magenta;
  }
`;

const STYLES_CARD_TITLE = css`
  font-family: ${Constants.font.system};
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  margin: 8px 0;
`;

const STYLES_CARD_SUBTITLE = css`
  font-family: ${Constants.font.system};
  color: ${Constants.REFACTOR_COLORS.subdued};
  font-size: 12px;
  word-wrap: break-word;
`;

class CreateHomeScreen extends React.Component {
  static defaultProps = {
    templates: [],
    history: [],
    refreshHistory: async () => {},
  };

  componentDidMount() {
    this.props.refreshHistory();
  }

  _navigateToRecentProject = (game, options) => {
    return this.props.navigateToGame(game, { launchSource: `create-recent`, ...options });
  };

  _handleOpenProject = async () => {
    try {
      const path = await NativeUtil.chooseOpenProjectPathWithDialogAsync();
      if (path) {
        await this.props.navigateToGameUrl(`file://${path}`, { launchSource: 'create-project' });
      }
    } catch (_) {}
  };

  _renderRecentProject = (project) => {
    const title = project.title ? project.title : 'Untitled';
    return (
      <div
        key={`project-${project.key}`}
        className={STYLES_LINK_CARD}
        onClick={() => this._navigateToRecentProject(project)}>
        <div className={STYLES_CARD_TITLE}>{title}</div>
        <div className={STYLES_CARD_SUBTITLE}>{project.url}</div>
      </div>
    );
  };

  _renderRecentProjects = () => {
    // TODO: merge logic with SidebarProjects
    const recentProjects = UserStatus.uniqueLocalUserStatuses(this.props.history).map(
      (historyItem) => {
        return { ...historyItem.game, key: historyItem.userStatusId };
      }
    );
    if (recentProjects && recentProjects.length) {
      return (
        <div className={STYLES_SECTION}>
          <div className={STYLES_SECTION_TITLE}>Open a recent project</div>
          <div className={STYLES_RECENT_PROJECTS}>
            {recentProjects.map(this._renderRecentProject)}
            <div
              key={`project-open`}
              className={STYLES_LINK_CARD}
              onClick={this._handleOpenProject}>
              <div className={STYLES_CARD_TITLE}>Open another project...</div>
              <div className={STYLES_CARD_SUBTITLE}>Open a project from your computer.</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  render() {
    const { templates, selectedTemplate, onSelectTemplate } = this.props;

    return (
      <React.Fragment>
        {this._renderRecentProjects()}
        <div className={STYLES_SECTION}>
          <div className={STYLES_SECTION_TITLE}>Create a new project</div>
          <ProjectTemplateChooser
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onSelectTemplate}
          />
        </div>
        <div className={STYLES_DOCUMENTATION}>
          <div className={STYLES_SECTION_TITLE}>Help and Documentation</div>
          <div className={STYLES_DOCS_LINKS}>
            {DOCS_LINKS.map((link, ii) => (
              <div
                key={`doc-${ii}`}
                className={STYLES_LINK_CARD}
                onClick={() => NativeUtil.openExternalURL(link.url)}>
                <div className={STYLES_CARD_TITLE}>{link.title}</div>
                <div className={STYLES_CARD_SUBTITLE}>{link.description}</div>
              </div>
            ))}
            <div className={STYLES_LINK_CARD} onClick={this._handleOpenProject}>
              <div className={STYLES_CARD_TITLE}>Open project</div>
              <div className={STYLES_CARD_SUBTITLE}>Open a project from your computer.</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default class CreateHomeScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <CurrentUserContext.Consumer>
            {(currentUser) => (
              <CreateHomeScreen
                projectOwner={currentUser.user}
                navigateToGame={navigator.navigateToGame}
                history={currentUser.userStatusHistory}
                refreshHistory={currentUser.refreshCurrentUser}
                {...this.props}
              />
            )}
          </CurrentUserContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
