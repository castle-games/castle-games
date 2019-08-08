import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { getCategories, getEmojiComponent } from '~/common/emoji/emoji-utilities';

const STYLES_CONTAINER = css`
  position: absolute;
  bottom: 56px;
  right: 16px;
  width: 384px;

  padding: 8px;

  border-radius: 4px;
  border: 1px solid rgba(219, 219, 219, 1);
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const STYLES_SCROLLING_CONTAINER = css`
  height: 256px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_EMOJI_ITEM = css`
  padding: 4px;
  margin: 4px;
  border-radius: 3px;
  background: transparent;
  cursor: pointer;

  :hover {
    background: #ececec;
  }
`;

const STYLES_CATEGORY_SECTION = css`
  margin-bottom: 8px;
`;

const STYLES_CATEGORY_TITLE = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-size: 14px;
  margin: 0 0 4px 4px;
  cursor: default;
`;

const STYLES_CATEGORY_LIST = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  flex-wrap: wrap;
`;

const STYLES_NAV_CONTAINER = css`
  display: flex;
  border-bottom: 1px solid #ececec;
  margin-bottom: 8px;
`;

const STYLES_NAV_ITEM = css`
  cursor: pointer;
  border-radius: 3px;
  padding: 4px;
  margin: 0 4px 4px 4px;

  :hover {
    background: #ececec;
  }
`;

const CATEGORY_HEADER_EMOJI = [
  'tada',
  'grinning',
  'leaves',
  'hamburger',
  'airplane',
  'soccer',
  'bulb',
  'arrow_right',
  'waving_black_flag',
  'skin-tone-4',
];

export default class ChatInputEmojiPicker extends React.Component {
  _categoryHeaderRefs = {};

  static defaultProps = {
    onSelectEmoji: (shortName) => {},
  };

  _scrollToCategoryIndex = (index) => {
    if (this._categoryHeaderRefs[index]) {
      this._categoryHeaderRefs[index].scrollIntoView();
    }
  };

  _renderCategoryNavigation = (categories) => {
    return (
      <div className={STYLES_NAV_CONTAINER}>
        {categories.map((category, ii) => (
          <div
            className={STYLES_NAV_ITEM}
            key={`category-nav-${ii}`}
            onClick={() => this._scrollToCategoryIndex(ii)}>
            {getEmojiComponent(CATEGORY_HEADER_EMOJI[ii])}
          </div>
        ))}
      </div>
    );
  };

  render() {
    const categories = getCategories();
    return (
      <div className={STYLES_CONTAINER}>
        {this._renderCategoryNavigation(categories)}
        <div className={STYLES_SCROLLING_CONTAINER}>
          {categories.map((category, ii) => (
            <div className={STYLES_CATEGORY_SECTION} key={`category-${ii}`}>
              <div
                className={STYLES_CATEGORY_TITLE}
                ref={(c) => (this._categoryHeaderRefs[ii] = c)}>
                {category.title}
              </div>
              <div className={STYLES_CATEGORY_LIST}>
                {category.emojis.map((short_name, jj) => (
                  <div
                    key={`emoji-${jj}`}
                    className={STYLES_EMOJI_ITEM}
                    onClick={() => this.props.onSelectEmoji(short_name, true)}>
                    {getEmojiComponent(short_name)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
