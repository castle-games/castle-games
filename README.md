# Castle

## Releases

See [Desktop Client Release Process](https://github.com/castle-games/ghost/wiki/Desktop-client-release-process).

## Code Style

Run `format.sh` after making changes to native code.

## Run on macOS

### Prereqs

- [Homebrew](https://brew.sh/)
- Git LFS (`brew install git-lfs`, Then run `git lfs install` in this repo)

### Run from Xcode

- Open './macosx/ghost.xcodeproj' with Xcode.
- Run the 'ghost-macosx' target:
  ![Run Castle on macOS](run-mac.png)
- If you want to test changes to the React UI, follow the readme in the `desktop` directory.

## Run on Windows

- Install https://gitforwindows.org/. *Use this program to clone the repo, not WSL.*
- Install CMake. https://cmake.org/download/
  - Make sure to check the "add to PATH for current user" option.
- Install Visual Studio 2017. https://visualstudio.microsoft.com/vs
  - When you are prompted to install some "Workloads", at the minimum you want "Desktop development with C++". You can come back to this screen later if you want more things.
- Install http://nsis.sourceforge.net.

### Debug build

1. Using either Git Bash or WSL...

- Make sure `git lfs` is initialized.
- In 'megasource/', run './run_cmake.sh'. You don't need to do this every time, but you need to do it at least on your first time, and whenever installer resources change.

2. Using Visual Studio...

- Open and build the 'ALL_BUILD.vcxproj' file inside of 'megasource/build/'.
- Run the application at 'megasourse/build/Debug/Castle.exe'.
- If the build succeeds but is unable to write Castle.exe, make sure any existing Castle processes are terminated and try again.
- If you're using WSL, `megasource/kill_castle.sh` works for terminating Castle processes.

### Release build

- Run './release.sh' in 'megasource/'. Use the installer at 'megasource/CastleSetup.exe' and then run Castle from the start menu.

## Run on Linux

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
