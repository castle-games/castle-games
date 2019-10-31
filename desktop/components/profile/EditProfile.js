import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import Plain from 'slate-plain-serializer';
import UIAvatar from '~/components/reusable/UIAvatar';
import UIFileInput from '~/components/reusable/UIFileInput';
import UIInputSecondary from '~/components/reusable/UIInputSecondary';
import UISubmitButton from '~/components/reusable/UISubmitButton';
import UITextArea from '~/components/reusable/UITextArea';

const STYLES_CONTAINER = css`
  color: ${Constants.colors.black};
  margin-bottom: 16px;
`;

const STYLES_SECTION = css`
  border-bottom: 1px solid #ececec;
  padding: 16px 24px 16px 24px;

  :last-child {
    border-bottom: 0;
  }
`;

const STYLES_HEADING = css`
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.2px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  margin-bottom: 12px;
`;

const STYLES_SECTION_CONTENT = css`
  display: flex;
`;

const STYLES_FIELDS = css`
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
`;

const STYLES_COLUMN = css`
  display: flex;
  flex-direction: column;
`;

const STYLES_GENERIC_INPUT = css`
  margin-bottom: 16px;
  margin-right: 16px;
`;

export default class EditProfile extends React.Component {
  state = {
    isExistingAvatarRemoved: false, // TODO: flag this once avatar removal is supported.
    isAvatarUploading: false,
    uploadedAvatarFile: null,
    isAnyFieldEdited: false,
    user: {
      about: Plain.deserialize(''),
    },
  };

  componentDidMount() {
    this._resetForm(this.props.user);
  }

  componentWillReceiveProps(nextProps) {
    const existingUserId =
      this.props.user && this.props.user.userId ? this.props.user.userId : null;
    const nextUserId = nextProps.user && nextProps.user.userId ? nextProps.user.userId : null;
    if (
      existingUserId == null ||
      nextUserId != existingUserId ||
      (nextUserId == existingUserId && nextProps.user.updatedTime !== this.props.user.updatedTime)
    ) {
      // we're rendering a new user, reset state.
      this._resetForm(nextProps.user);
    }
  }

  _resetForm = (user) => {
    const richAboutObject =
      user && user.about && user.about.rich
        ? Strings.loadEditor(user.about.rich)
        : Plain.deserialize('');
    this.setState({
      isExistingAvatarRemoved: false,
      isAvatarUploading: false,
      uploadedAvatarFile: null,
      user: {
        ...user,
        about: richAboutObject,
      },
      isAnyFieldEdited: false,
    });
  };

  _doesFormContainChanges = () => {
    const state = this.state;
    return (
      state.isExistingAvatarRemoved !== false ||
      state.uploadedAvatarFile !== null ||
      state.isAnyFieldEdited !== false
    );
  };

  _onAvatarNativeUploadStarted = () => this.setState({ isAvatarUploading: true });

  _onAvatarNativeUploadFinished = (success, result) => {
    if (success) {
      this._onAvatarUploaded(result);
    } else {
      this.setState({ isAvatarUploading: false });
    }
  };

  _onAvatarUploaded = (result) => {
    if (result) {
      this.setState({ uploadedAvatarFile: result, isAvatarUploading: false });
    } else {
      this.setState({ isAvatarUploading: false });
    }
  };

  _onAvatarFileInputChangeAsync = async (e) => {
    let files = e.target.files;
    if (files && files.length) {
      await this.setState({ isAvatarUploading: true });
      const result = await Actions.uploadImageAsync({
        file: files[0],
      });
      this._onAvatarUploaded(result);
    }
  };

  _onAboutChangeAsync = async ({ value }) => {
    this.setState({ user: { ...this.state.user, about: value } });
  };

  _onFieldChange = (e) => {
    this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } });
  };

  _onFieldFocus = (_) => {
    this.setState({ isAnyFieldEdited: true });
  };

  _onSubmitEditProfileAsync = async () => {
    let didSucceed = true;
    if (this.state.uploadedAvatarFile) {
      const result = await Actions.setUserPhotoAsync({
        userId: this.props.user.userId,
        fileId: this.state.uploadedAvatarFile.fileId,
      });
      if (!result) {
        didSucceed = false;
      }
    }
    if (this.state.isAnyFieldEdited) {
      const result = await Actions.updateUserAsync({
        userId: this.props.user.userId,
        user: this.state.user,
      });
      if (!result) {
        didSucceed = false;
      }
    }
    if (didSucceed) {
      if (this.props.onAfterSave) {
        this.props.onAfterSave();
      }
    }
  };

  _renderAvatarControl = () => {
    let avatarSrc;
    if (this.state.isExistingAvatarRemoved) {
      // display pending avatar removal.
      avatarSrc = null;
    } else if (this.state.uploadedAvatarFile) {
      // display pending avatar change.
      avatarSrc = this.state.uploadedAvatarFile.url;
    } else {
      // display existing creator avatar.
      avatarSrc = this.props.user && this.props.user.photo ? this.props.user.photo.url : null;
    }

    let avatarLoadingElement;
    let isAvatarUploadEnabled = true;
    if (this.state.isAvatarUploading) {
      avatarLoadingElement = <p>Uploading...</p>;
      isAvatarUploadEnabled = false;
    }

    return (
      <div className={STYLES_SECTION_CONTENT}>
        <UIAvatar
          src={avatarSrc}
          showIndicator={false}
          style={{ width: 128, height: 128, marginRight: 16 }}
        />

        <div className={STYLES_COLUMN}>
          {avatarLoadingElement}
          <UIFileInput
            id="avatar"
            name="avatar"
            style={isAvatarUploadEnabled ? {} : { display: 'none' }}
            onWebInputChange={this._onAvatarFileInputChangeAsync}
            onNativeFileUploadStarted={this._onAvatarNativeUploadStarted}
            onNativeFileUploadFinished={this._onAvatarNativeUploadFinished}
          />
        </div>
      </div>
    );
  };

  _renderGenericField = (name, label, placeholder) => {
    const value = this.state.user[name];
    return (
      <div className={STYLES_GENERIC_INPUT}>
        <UIInputSecondary
          name={name}
          value={value}
          label={label}
          onChange={this._onFieldChange}
          onFocus={this._onFieldFocus}
          placeholder={placeholder}
          style={{ width: 480 }}
        />
      </div>
    );
  };

  _renderAboutField = () => {
    const value = this.state.user.about;
    return (
      <div className={STYLES_SECTION_CONTENT}>
        <UITextArea
          value={value}
          label="About"
          onChange={this._onAboutChangeAsync}
          onFocus={this._onFieldFocus}
          placeholder="Write something about yourself..."
          style={{ width: 480, marginBottom: 16 }}
        />
      </div>
    );
  };

  render() {
    const isSubmitEnabled = this._doesFormContainChanges();
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <UISubmitButton disabled={!isSubmitEnabled} onClick={this._onSubmitEditProfileAsync}>
            Save Changes
          </UISubmitButton>
        </div>
        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Avatar</div>
          {this._renderAvatarControl()}
        </div>
        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Profile Info</div>
          <div className={STYLES_FIELDS}>
            {this._renderGenericField('name', 'Name', 'Name shown below your username (optional)')}
            {this._renderGenericField(
              'websiteUrl',
              'Website',
              'URL shown on your profile (optional)'
            )}
            {this._renderGenericField('itchUsername', 'Itch', 'Itch username (optional)')}
            {this._renderGenericField('twitterUsername', 'Twitter', 'Twitter handle (optional)')}
          </div>
          {/* this._renderAboutField() */}
        </div>
      </div>
    );
  }
}
