import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIAvatar from '~/core-components/reusable/UIAvatar';
import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTAINER = css`
  background ${Constants.colors.background};
  color: ${Constants.colors.white};
  border-top: 16px solid ${Constants.colors.foreground};
`;

const STYLES_SECTION = css`
  border-bottom: 1px solid ${Constants.colors.border};
  padding: 16px 32px 16px 32px;

  :last-child {
    border-bottom: 0;
  }
`;

const STYLES_HEADING = css`
  font-weight: 600;
  font-size: 12px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  margin-bottom: 12px;
`;

const STYLES_SECTION_CONTENT = css`
  display: flex;
`;

const STYLES_AVATAR_CONTROL = css`
  display: flex;
  flex-direction: column;
`;

const STYLES_FILE_INPUT = css`
  display: inline-flex;
`;

export default class CoreEditProfile extends React.Component {
  state = {
    isExistingAvatarRemoved: false,
    uploadedAvatarFile: null,
  };

  componentWillReceiveProps(nextProps) {
    const existingUserId = (this.props.user && this.props.user.userId) ?
          this.props.user.userId :
          null;
    const nextUserId = (nextProps.user && nextProps.user.userId) ?
          nextProps.user.userId :
          null
    if (nextUserId != existingUserId) {
      // we're rendering a new user, reset state.
      this._resetForm();
    }
  }

  _resetForm = (callback) => {
    const maybeCallback = (callback) ? callback : () => {};
    this.setState({
      isExistingAvatarRemoved: false,
      uploadedAvatarFile: null,
    }, maybeCallback);
  };
  
  _onAvatarFileInputChangeAsync = async (e) => {
    let files = e.target.files;
    if (files && files.length) {
      const result = await Actions.uploadImageAsync({
        file: files[0],
      });
      if (result) {
        this.setState({ uploadedAvatarFile: result });
      }
    }
  };

  _onSubmitEditProfileAsync = async () => {
    let didSucceed = true;
    if (this.state.uploadedAvatarFile) {
      const result = await Actions.setUserPhotoAsync({
        userId: this.props.user.userId,
        fileId: this.state.uploadedAvatarFile.fileId,
      });
      if (!result || !result.updateUser) {
        didSucceed = false;
      }
    }
    if (didSucceed) {
      this._resetForm(() => {
        if (this.props.onAfterSave) {
          this.props.onAfterSave();
        }
      });
    }
  };

  _renderAvatarControl = () => {
    let avatarSrc;
    if (this.state.isExistingAvatarRemoved) {
      // display pending avatar removal.
      avatarSrc = null;
    } else if (this.state.uploadedAvatarFile) {
      // display pending avatar change.
      avatarSrc = this.state.uploadedAvatarFile.imgixUrl;
    } else {
      // display existing creator avatar.
      avatarSrc = (this.props.user && this.props.user.photo)
        ? this.props.user.photo.imgixUrl
        : null;
    }
    return (
      <div className={STYLES_SECTION_CONTENT}>
        <UIAvatar
          src={avatarSrc}
          style={{ width: 128, height: 128, marginRight: 16 }}
          />
        <div className={STYLES_AVATAR_CONTROL}>
          <input
            type="file"
            id="avatar"
            name="avatar"
            className={STYLES_FILE_INPUT}
            onChange={this._onAvatarFileInputChangeAsync}
            />
        </div>
      </div>
    )
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Avatar</div>
          {this._renderAvatarControl()}
        </div>
        <div className={STYLES_SECTION}>
          <UIControl onClick={this._onSubmitEditProfileAsync}>Save Changes</UIControl>
        </div>
      </div>
    );
  }
}
