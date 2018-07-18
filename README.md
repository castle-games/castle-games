# Ghost (name TBD)

Hello traveler! I'm Ghost. Don't worry, I'm not the scary kind of ghost, just a spirit that likes to
explore, probably like yourself. Anyways... You probably want to just try this thing out. So let's
do that!

## Run Ghost

### iOS

Open './love/platform/xcode/love.xcodeproj' with Xcode and run the 'love-ios' target.

### macOS

Copy the '.framework' files in https://love2d.org/sdk/love-osx-frameworks-0.10.zip to
'/Library/Frameworks' if you haven't done that before. Open './love/platform/xcode/love.xcodeproj'
with Xcode and run the 'love-macosx' target.

### Windows

- Install CMake.
- Install Visual Studio 2013. Versions later than 2013 have a certain bug in the C++ standard
  library that is rarely hit, but happens to be hit for the Love 2D build.
- In 'megasource/', run 'sh ./run_cmake.sh' (I've done this with the 'Git BASH' utility that comes
  with 'Git for Windows', but you could also just run the one command inside this file from the
  Windows command line).
- Open and build the '.sln' file you will find deep inside 'megasource/build/'.

### Linux

You should be able to use CMake to build under 'love/'.

## Portals

Portals offer views into content from the web to render as a Lua/Love game. That's how the 'Base'
experience included with Ghost loads other experiences. You can load your own portals that you
create, and have those portals load other portals, and so on. You have full freedom now how portals
your portal loads are displayed, given input, and managed.

Edit 'base/main.lua' to change the default portal(s) opened by the Base.

The current portal you are in is available as the global object `portal`. You can create a new
portal with `local newPortal = portal:newChild(<url>)`. You then need to call `newPortal:draw()` or
`newPortal:keypressed(...)` or such to forward events to it. This gives you full control over how
sub-portals work. 'base/main.lua' has an example of creating portals and controlling them

## Lua

- We use LuaJIT for Lua, which is exactly [Lua 5.1](https://www.lua.org/manual/5.1/) with some
  [additions](http://luajit.org/extensions.html).
- Lua is mostly sort of like JavaScript and hopefully should be easy to pick up!
- There are a lot of good benefits from using Lua, and also of course tradeoffs, vs. other languages
  (JavaScript probably being the main other one). Here are some of the many benefits:
  - Quite small and easy to pick up for people new to programming (subjective I guess).
  - LuaJIT makes Lua extremely fast. The JIT runs on macOS, Windows and Linux. On iOS and Android,
    only the interpreter runs, but LuaJIT's interpreter is still much faster than the original Lua
    one.
  - The Love game engine is available. It's open source, has breaking changes to its interface only
    approximately once every 3 years, and the code is small and neat enough for it to be
    well-understood by the whole team. It's well-documented. It's API is the same across all
    the desktop and mobile platforms Ghost supports.
  - Coroutines make non-blocking asynchronous calls possible without having to explicitly `await `
    them. This made it possible to wrap the `require` call in Lua to add network fetching, which lies
    at the core of Ghost.
  - There's a lot more...
- We use Lua's [coroutines](http://leafo.net/posts/itchio-and-coroutines.html) for asynchronous I/O.
  This makes it so when you do a network call from somewhere in the main loop, for example, you want
  to write `network.async(function() ... end)`, sort of like `dispatch_async(...)` in iOS. There's
  no need to explicitly write `async` or `await` anywhere like in JavaScript. This is also what
  makes `require 'http://...'` work for code that assumes synchronous `require`.
