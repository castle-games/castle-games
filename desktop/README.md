## Castle Desktop Interface

```sh
  |
  |-- web                         # build folder, don't edit this folder.
  |-- desktop                     # source folder
  |     |-- public                # skeleton of build folder, you can edit this.
  |     |-- src                   # entry point (index.js) and root component (App.js)
  |     |-- common                # non-React shared logic
  |     |-- components            # React components
  |     |-- contexts              # React contexts
  |     |-- native                # interface with native code
  |     |-- screens               # top-level screens you can navigate to
  |     |-- static                # static resources
  |     |-- webpack.config.js     # hell on earth

```

## React File Structure

* We use prettier and that covers most cases.
* This example snippet reveals how your file should be organized for the other cases.

```js
import * as React from 'react';
import * as A from '~/path/to/a';
import * as B from '~/path/to/b';
import * as C from '~/path/to/c';

import { css } from 'react-emotion';
import { D, E, F } from '~/path/to/setA';
import { G, H, I } from '~/path/to/setB';

import FullNameA from '~/path/to/FullNameA';
import FullNameB from '~/path/to/FullNameB';
import FullNameC from '~/path/to/FullNameC';

const CONSTANT_VALUE_EXAMPLE = 1;

const STYLES_EXAMPLE = css`
  background: red;
`;

export default class ExampleClass extends React.Component {
  _container;

  publicMethod = () => {
    // NOTE(jim):
    // Don't add an underscore if the method is public.
  }

  _handleVerb = () => {
    // NOTE(jim):
    // If your method is invoked via a javascript event handler
    // then use the handle prefix. Add an underscore if the
    // method is private.
  }

  render() {
    return (
      <div 
        ref={c => {this._container = c}}
        className={STYLES_EXAMPLE} 
        onClick={this._handleVerb}>
        Hello World
      </div>
    );
  }
}

```

### Run locally

From inside of 'desktop' directory, run:

```sh
npm install
npm run start
```

### Build changes

Run

```sh
npm run build
```

### See it in Castle

`npm run build` will write the bundled files that Castle uses by default.

If you want to point Castle at your local webserver without repeatedly building, on macOS you can edit `ghost-env.plist` to use `CastleUseCustomWebUrl`: `YES` and `CastleCustomWebUrl`: `http://localhost:3000`. Don't commit this change.

### Code Style

Either use an editor with `prettier` integrated already, or alternatively run `npm run prettier` after staging files for commit.