import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Project from '~/common/project';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
  padding-right: 8px;

  figure {
    border-radius: ${Constants.card.radius};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    transition: 200 cubic-bezier(0.17, 0.67, 0.83, 0.67) all;
  }
`;

const STYLES_TEMPLATE_CONTAINER = css`
  display: inline-block;
  padding: 0 16px 16px 0;
  cursor: pointer;
`;

const STYLES_GAME_COVER = css`
  width: ${Constants.card.width};
  height: ${Constants.card.imageHeight};
  cursor: pointer;
  background-size: cover;
  background-position: 50% 50%;
  background-color: ${Constants.colors.black};
  margin-bottom: 4px;
`;

const STYLES_GAME_TITLE = css`
  display: inline-flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-family: ${Constants.font.system};
  line-height: ${Constants.linescale.lvl6};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;

export default class ProjectTemplateChooser extends React.Component {
  static defaultProps = {
    templates: [],
    selectedTemplate: null,
    onSelectTemplate: (template) => {},
  };

  _renderBlankTemplate = () => {
    return (
      <div
        key={Project.BLANK_TEMPLATE_ID}
        className={STYLES_TEMPLATE_CONTAINER}
        onClick={() =>
          this.props.onSelectTemplate({ gameId: Project.BLANK_TEMPLATE_ID, title: 'blank' })
        }>
        <figure className={STYLES_GAME_COVER} />
        <div className={STYLES_GAME_TITLE}>blank</div>
      </div>
    );
  };

  _renderTemplate = (game) => {
    const coverSrc = game.coverImage ? game.coverImage.url : null;
    let styles =
      this.props.selectedTemplate && game.gameId == this.props.selectedTemplate.gameId
        ? { backgroundColor: Constants.colors.background4 }
        : null;
    return (
      <div
        key={game.gameId}
        className={STYLES_TEMPLATE_CONTAINER}
        style={styles}
        onClick={() => this.props.onSelectTemplate(game)}>
        <figure
          className={STYLES_GAME_COVER}
          style={{ backgroundImage: coverSrc ? `url(${coverSrc})` : null }}
        />
        <div className={STYLES_GAME_TITLE}>{game.title}</div>
      </div>
    );
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        {this._renderBlankTemplate()}
        {this.props.templates.map((game) => this._renderTemplate(game))}
      </div>
    );
  }
}
