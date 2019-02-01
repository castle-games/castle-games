import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

const STYLES_LOADER = css`
	position: absolute;
	z-index: 1;
	left: 0;
	top: 0;
	right: 0;
`;

const STYLES_LOADER_BAR = css`
	@keyframes animation-url-loader {
		from {
			width: 0%;
		}

		to {
			width: 100%;
		}
	}

	animation: animation-url-loader 800ms cubic-bezier(0.4, 0.7, 1, 0.1) infinite;
	display: block;
	background: ${Constants.colors.green};
	height: 2px;
	position: absolute;
`;

export default class UIInputLoader extends React.Component {
	render() {
		return (
			<div className={STYLES_LOADER}>
				{this.props.isLoading ? <div className={STYLES_LOADER_BAR} /> : null}
			</div>
		);
	}
}
