import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Project from '~/common/project';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  margin-bottom: 16px;
  display: flex;
`;

const STYLES_INFO = css`
  width: 100%;
`;

const STYLES_TITLE = css`
  font-size: ${Constants.typescale.lvl6};
  line-height ${Constants.linescale.lvl6};
  color: ${Constants.colors.text};
  font-weight: 700;
  margin-bottom: 16px;
`;

const STYLES_PARAGRAPH = css`
  font-size: ${Constants.typescale.lvl6};
  line-height ${Constants.linescale.lvl6};
  color: ${Constants.colors.text};
`;

const STYLES_GAME_COVER = css`
  width: ${Constants.card.mini.width};
  height: ${Constants.card.mini.imageHeight};
  background-size: cover;
  background-position: 50% 50%;
  background-color: ${Constants.colors.black};
  flex-shrink: 0;
  margin-right: 16px;
  border-radius: ${Constants.card.radius};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transition: 200 cubic-bezier(0.17, 0.67, 0.83, 0.67) all;
`;

const STYLES_BLANK_GAME_COVER = css`
  width: ${Constants.card.mini.width};
  height: ${Constants.card.mini.imageHeight};
  background-color: ${Constants.colors.white};
  border: 1px solid ${Constants.colors.background3};
  flex-shrink: 0;
  margin-right: 16px;
  border-radius: ${Constants.card.radius};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transition: 200 cubic-bezier(0.17, 0.67, 0.83, 0.67) all;
`;

export default class ProjectTemplatePreview extends React.Component {
  static defaultProps = {
    template: null,
  };

  render() {
    const { template } = this.props;
    const coverSrc = template.coverImage ? template.coverImage.url : null;
    const isBlankProject = template.gameId === Project.BLANK_TEMPLATE_ID;
    return (
      <div className={STYLES_CONTAINER}>
        <div
          className={isBlankProject ? STYLES_BLANK_GAME_COVER : STYLES_GAME_COVER}
          style={{ backgroundImage: coverSrc ? `url(${coverSrc})` : null }}
        />
        <div className={STYLES_INFO}>
          <div className={STYLES_TITLE}>{this.props.template.title}</div>
          <div className={STYLES_PARAGRAPH}>{this.props.template.description}</div>
        </div>
      </div>
    );
  }
}
