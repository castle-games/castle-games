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