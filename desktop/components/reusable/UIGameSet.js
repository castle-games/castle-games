import * as React from 'react';
import * as Constants from '~/common/constants';

import UIGameCell from '~/components/reusable/UIGameCell';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  margin-top: 0px;
`;

const STYLES_GAME_ROW = css`
  display: flex;
  align-items: flex-start;
  flex-wrap: no-wrap;
  margin: 0px 0px 0px 16px;
`;

const STYLES_GAME_GRID = css`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 0px 0px 0px 16px;
`;

const STYLES_ROW_TITLE = css`
  font-family: ${Constants.font.system};
  margin: 0px 0px 16px 24px;
  font-size: 18px;
  font-weight: 700;
  width: 260px;
`;

const STYLES_CELL_ITEM = css``;

export default class UIGameSet extends React.Component {
  static defaultProps = {
    renderAsGrid: false,
  };

  state = {
    width: null,
    gameItemsToRender: null,
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  componentDidMount() {
    window.addEventListener('resize', this._handleResize);
    this._handleResize();
  }

  _handleResize = () => {
    const width = this._containerRef.offsetWidth;
    this.setState({ width });
  };

  _maxGameItemsWhichFitOntoScreen() {
    const numItemsToRender =
      (this.state.width - 24) / (parseInt(Constants.sizes.cardWidth, 10) + 12);
    return this.props.gameItems.slice(0, numItemsToRender);
  }

  render() {
    return (
      <div
        className={STYLES_CONTAINER}
        ref={(c) => {
          this._containerRef = c;
        }}>
        <div className={STYLES_ROW_TITLE}>{this.props.title}</div>
        <div className={this.props.renderAsGrid ? STYLES_GAME_GRID : STYLES_GAME_ROW}>
          {this._maxGameItemsWhichFitOntoScreen().map((m, i) => {
            const key = m.key ? m.key : m.gameId ? m.gameId : m.url;
            return (
              <div className={STYLES_CELL_ITEM} key={`${key}-i`}>
                <UIGameCell
                  renderCartridgeOnly={this.props.renderCartridgeOnly}
                  onGameSelect={this.props.onGameSelect}
                  onShowGameInfo={this.props.onShowGameInfo}
                  underConstruction={this.props.underConstruction}
                  onGameUpdate={this.props.onGameUpdate}
                  onUserSelect={this.props.onUserSelect}
                  onSignInSelect={this.props.onSignInSelect}
                  src={m.coverImage && m.coverImage.url}
                  game={m}
                  viewer={this.props.viewer}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
