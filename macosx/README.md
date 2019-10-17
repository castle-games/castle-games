# Castle for macOS

## Prereqs

- Xcode 10+
- [Homebrew](https://brew.sh/)
- Git LFS (`brew install git-lfs`, Then run `git lfs install` in this repo)
- `git lfs pull`

## Build and Run from Xcode

- Open `ghost.xcodeproj` with Xcode.
- Run the `ghost-macosx` target:
  ![Run Castle on macOS](https://user-images.githubusercontent.com/1316332/67033335-5c0e1e80-f0ca-11e9-935f-f04c26f00b7f.png)
- If you want to test changes to the React UI, follow the readme in `../desktop`.

## Releases

For CI, codesigning, notarization, certificates, gatekeeper, etc. see [DISTRIBUTION.md](DISTRIBUTION.md).