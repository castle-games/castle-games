import * as React from 'react';

import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  min-width: 72px;
`;

const STYLES_LABEL = css`
  cursor: pointer;
  hover {
    text-decoration: underline;
  }
`;

export default class GameFavoriteControl extends React.Component {
  static contextType = CurrentUserContext;

  state = {
    hovering: false,
    clicked: false,
  };

  _onClick = () => {
    // TODO: send favorite toggle request
    // TODO: update game cache model
    return this.setState({ clicked: true });
  };

  render() {
    const { game } = this.props;
    const { hovering, clicked } = this.state;
    const { user } = this.context;

    if (!game) return null;

    // TODO: star full or star empty
    let label;
    let interactable = true;
    if (!user || user.isAnonymous) {
      interactable = false;
      label = 'Sign up to add this game as a favorite';
    } else if (hovering && clicked) {
      label = game.isFavorite ? 'Removed' : 'Added';
    } else if (hovering) {
      label = game.isFavorite ? 'Remove Favorite' : 'Add Favorite';
    } else {
      label = game.isFavorite ? 'Favorited' : 'Add Favorite';
    }
    return (
      <div
        className={STYLES_CONTAINER}
        onMouseOver={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false, clicked: false })}>
        <p className={STYLES_LABEL} onClick={this._onClick}>
          {label}
        </p>
      </div>
    );
  }
}
