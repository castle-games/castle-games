## Writing React Code Inside Of Ghost

```sh
  |
  |-- web                         # build folder, don't edit this folder.
  |-- desktop                     # source folder
  |     |-- public                # skeleton of build folder, you can edit this.
  |     |-- src                   # where all the component fun goes
  |     |-- webpack.config.js     # hell on earth

```

### Jim I have 3 seconds of patience how do I run the code locally

From inside of 'desktop' directory, run:

```sh
npm install
npm run start
```

Look at `localhost:3000`

### Jim how do I build my changes

Run

```sh
npm run build
```

### Jim how do I see it in ghost

`npm run build` will write the bundled files that Castle uses by default.

If you want to point Castle at your local webserver without repeatedly building, on macOS you can edit `ghost-env.plist` to use `CastleUseCustomWebUrl`: `YES` and `CastleCustomWebUrl`: `http://localhost:3000`. Don't commit this change.
