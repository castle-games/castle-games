# Castle

## Project Structure

```
  |-- base              # Lua source for the Ghost engine
  |-- cef               # CEF lib for macOS and Windows
  |-- ci                # continuous integration for automatic Castle builds and releases
  |-- common            # crossplatform native code
  |-- desktop           # Castle's React UI source code
  |-- ghost-extensions  # supporting libraries for the Ghost engine
  |-- love              # Love2d source
  |-- macosx            # macOS-specific native code
  |-- megasource        # windows build stuff
  |-- mobile            # mobile source
  |-- node              # Embedded node server for running some cross-platform operations
  |-- openssl           # openssl lib for Ghost engine
  |-- shared-assets     # static assets that need to be included crossplatform
  |-- web               # built JS bundles for Castle's React UI
  |-- win               # Windows-specific native code
```

## Code Style

- Run `format.sh` after making changes to native code.
- For JS code in the desktop UI, see [desktop/README.md](desktop/README.md).

## Run on macOS

See [macosx/README.md](macosx/README.md).

## Run on mobile

See [mobile/README.md](mobile/README.md).

## Run on Windows

### Prereqs

- Install https://gitforwindows.org/. *Use this program to clone the repo, not WSL.*
- Install CMake. https://cmake.org/download/
  - Make sure to check the "add to PATH for current user" option.
- Install Visual Studio 2017. https://visualstudio.microsoft.com/vs
  - When you are prompted to install some "Workloads", at the minimum you want "Desktop development with C++". You can come back to this screen later if you want more things.

### Build and run

Use either Git Bash or WSL to run commands in.

- Make sure Git LFS is initialized.
- Go into the 'megasource/' directory.
- Run `sh configure_cmake.sh`. You don't need to do this every time, but you need to do it at least on the first build.
- Run `cmake.exe --build build --config Debug`. If the build succeeds but is unable to write 'Castle.exe', make sure any existing Castle processes are terminated and try again. On WSL, `sh kill_castle.sh` under 'megasource/' works for terminating Castle processes.
- Run `./build/Debug/Castle.exe` to launch the Castle binary that was built.

## Run on Linux

See [LINUX.md](./LINUX.md).