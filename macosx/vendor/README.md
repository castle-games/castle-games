# Vendored macOS libs

At the time of writing, other stuff in our build (namely CEF and SDL) make it a bit annoying to move over to Cocoapods, but we might do that at some point.

In the meantime, here is where we put some vendored libs.

TODO: Move obs here as well.

### Bugsnag

- We follow "manual installation": https://docs.bugsnag.com/platforms/macos-objc/

### boost

- See [boost/README.md](./boost/README.md).

### obs

- See [obs/README.md](./obs/README.md) to build.
- obs is currently not part of the mac build. The dylibs will probably need to be rebuilt if we re-enable obs.
- Once built, re-add the various obs dylibs and `ffmpeg` to the ghost project, and unstub `ghost_obs.h|cpp`.

### mpg123

- We built our own mpg123 framework because the one included with Love won't pass macOS notarization.
- Specifically, Apple requires all executables to be built with the mac 10.9 SDK or newer, but their copy was built with 10.8, so we need to rebuild it on a newer machine.
- The `mpg123-1.16.0` folder was created by:
  - Downloading the source from mpg123's website
  - Opening `ports/Xcode/mpg123.xcodeproj`
  - Making a new Framework target, `mpg123`
  - Adding all the source files and header files
  - Resetting all the build settings to match the project defaults
  - Deleting the Apple default header which imports Foundation
  - Including the default, crossplatform `mpg123.h` header (not the one under `ports`)
- To use this vendored copy of the source:
  - Open `ports/Xcode/mpg123.xcodeproj` in Xcode
  - Make a release build
  - Copy the resulting `.framework` into our Frameworks dir
- To verify that it will pass notarization:
  - `otool -l Frameworks/mpg123.framework/Versions/A/mpg123 | grep "sdk 10"` and make sure the result is greater than `10.8`