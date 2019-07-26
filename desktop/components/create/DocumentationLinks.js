import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

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

const STYLES_DOCS_LINKS = css`
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

export default class DocumentationLinks extends React.Component {
  render() {
    return (
      <React.Fragment>
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
        </div>
      </React.Fragment>
    );
  }
}
