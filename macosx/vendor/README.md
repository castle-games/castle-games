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