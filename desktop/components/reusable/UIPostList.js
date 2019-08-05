import * as React from 'react';

import { css } from 'react-emotion';

import UIPostCell from '~/components/reusable/UIPostCell';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 0px 24px 16px 24px;
`;

export default class UIPostList extends React.Component {
  render() {
    const { posts } = this.props;
    return (
      <div className={STYLES_CONTAINER}>
        {posts.map((post, i) => {
          return (
            <UIPostCell
              key={`post-${post.postId}-${i}`}
              onGameSelect={this.props.onGameSelect}
              onUserSelect={this.props.onUserSelect}
              post={post}
              style={{ margin: '0 24px 48px 0', maxWidth: 500 }}
            />
          );
        })}
      </div>
    );
  }
}
