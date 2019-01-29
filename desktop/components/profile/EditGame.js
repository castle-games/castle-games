import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import { Value } from 'slate';
import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UIButtonSecondary from '~/core-components/reusable/UIButtonSecondary';
import UIInputSecondary from '~/core-components/reusable/UIInputSecondary';
import UITextArea from '~/core-components/reusable/UITextArea';
import UISubmitButton from '~/core-components/reusable/UISubmitButton';

import ContentEditor from '~/editor/ContentEditor';
import DefaultState from '~/editor/default.json';

const STYLES_CONTAINER = css`
  background ${Constants.colors.background};
  color: ${Constants.colors.white};
  border-top: 16px solid ${Constants.colors.border};
`;

const STYLES_SECTION = css`
  padding: 16px 16px 24px 16px;
  border-bottom: 1px solid ${Constants.colors.border};

  :last-child {
    border-bottom: 0;
  }
`;

const STYLES_FORM_ACTIONS = css`
  display: flex;
  margin-top: 12px;
`;

export default class EditGame extends React.Component {
  state = {
    game: {
      gameId: null,
      name: '',
      url: '',
    },
  };

  componentDidMount() {
    this._resetForm(this.props.game);
  }

  componentWillReceiveProps(nextProps) {
    const existingGameId = (this.props.game && this.props.game.gameId) ?
          this.props.game.gameId :
          null;
    const nextGameId = (nextProps.game && nextProps.game.gameId) ?
          nextProps.game.gameId :
          null
    // TODO: ben: updatedTime is valid?
    if (existingGameId == null || nextGameId != existingGameId ||
        (
          nextGameId == existingGameId &&
          nextProps.game.updatedTime !== this.props.game.updatedTime
        )
       ) {
      // we're rendering a new user, reset state.
      this._resetForm(nextProps.game);
    }
  }

  _resetForm = (game) => {
    this.setState({
      game: {
        ...game,
      },
    });
  };

  _handleChangeGame = e => {
    this.setState({ game: { ...this.state.game, [e.target.name]: e.target.value } });
  };

  _isFormSubmittable = () => {
    return (
      this.state.game &&
      this.state.game.name && this.state.game.name.length > 0 &&
      this.state.game.url && this.state.game.url.length > 0
    );
  };

  _removeGameAsync = async () => {
    const gameId = (this.props.game) ? this.props.game.gameId : null;
    // TODO: we don't have a way to remove games yet
    /* if (gameId) {
      const response = await Actions.removeGame({ gameId });
      if (!response) {
        return;
      }

      if (this.props.onAfterSave) {
        this.props.onAfterSave();
      }
    } */
  };
  
  _handleSubmitForm = async () => {
    let response;
    // TODO: we don't have a way to update or re-index games yet
    /* if (this.state.game.gameId) {
      response = await Actions.updateGameAsync({
        gameId: this.state.game.gameId,
        game: { ...this.state.game },
      });
      if (!response) {
        return;
      }
    } else {
      response = await Actions.addGame({ game: { ...this.state.game } });
      if (!response) {
        return;
      }
    }

    await this.setState({
      game: {
        ...response,
      },
    }); */

    if (this.props.onAfterSave) {
      this.props.onAfterSave();
    }
  };

  render() {
    const isSubmitEnabled = this._isFormSubmittable();
    const isEditing = !!(this.props.game && this.props.game.gameId);
    const gameTitle = (isEditing && this.props.game && this.props.game.name) ? this.props.game.name : 'an untitled game';
    const formTitle = (isEditing) ?
          `Editing ${gameTitle}` :
          'Link a game to your Castle profile';
    const formAction = (isEditing) ? 'Save Changes' : 'Add';

    let maybeDeleteButton;
    if (isEditing) {
      maybeDeleteButton = (
        <div style={{ marginLeft: 32 }}>
          <UIButtonSecondary
            onClick={this._removeGameAsync}>
            Delete
          </UIButtonSecondary>
        </div>
      );
    }
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <UIEmptyState
            style={{ padding: `0 0 24px 0`, color: Constants.colors.white }}
            title={formTitle}>
            When you link a game to Castle, it appears on your Castle profile.
          </UIEmptyState>
          <UIInputSecondary
            value={this.state.game.name}
            name="name"
            label="Game Title"
            onChange={this._handleChangeGame}
            style={{ marginBottom: 8 }}
          />
          <UIInputSecondary
            value={this.state.game.url}
            name="url"
            label="Game URL"
            onChange={this._handleChangeGame}
            style={{ marginBottom: 8 }}
          />
          <div className={STYLES_FORM_ACTIONS}>
            <UISubmitButton
              disabled={!isSubmitEnabled}
              onClick={this._handleSubmitForm}>
              {formAction}
            </UISubmitButton>
            {maybeDeleteButton}
          </div>
        </div>
      </div>
    );
  }
}
