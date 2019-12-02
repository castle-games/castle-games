# Castle on Linux

Thanks for your interest in Castle!

Castle's underlying engine is known to work on Linux, but we aren't currently maintaining a reliable way of building a Castle Client binary for this platform.

If it interests you, we're looking for someone to help us restore Castle to working order on Linux. This will involve getting Chromium Embedded Framework, SDL, Love2D, and an assortment of platform-specific native bindings to all cooperate with each other. Please reach out to us on Discord if you want to talk about this.

## An old, non-working, partial README

Below is a set of partial instructions for getting Castle working on Linux. *These are most recently known to fail and they need maintenance*, but they're here as a place to get started:

- You will need the following library dependencies, however they are distributed
  in your distribution of Linux: SDL2, libGLU, openal, luajit, libdevil,
  freetype, physfs, libmodplug, mpg123, libogg, libvorbis, libtheora, openssl.
- You will also need CMake and the usual gcc commands.
- In the 'love/' directory, run `cmake -H. -Bbuild`.
- Then go into the 'build/' directory that created, and run `make` (tip: add
  `-j5` as an argument to use more CPU and less time).
- This results in a 'love' binary in that directory.
- Now from the 'base/' directory at the root of your checkout of this
  repository, run `../love/build/love .`.

