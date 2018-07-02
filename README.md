# Ghost (name TBD)

Hello traveler! I'm Ghost. Don't worry, I'm not the scary kind of ghost, just a spirit that likes to
explore, probably like yourself. Anyways... You probably want to just try this thing out. So let's
do that!

## Run Ghost

### macOS

Copy the '.framework' files in https://love2d.org/sdk/love-osx-frameworks-0.10.zip to
'/Library/Frameworks' if you haven't done that before. Open './love/platform/xcode/love.xcodeproj'
with Xcode and run the 'love-macosx' target.

### iOS

Open './love/platform/xcode/love.xcodeproj' with Xcode and run the 'love-ios' target.

## Portals

By default Ghost opens a portal to
'https://raw.githubusercontent.com/nikki93/ghost-home/master/main.lua' -- which is 'main.lua' under
the submodule linked by './home'. Edit 'base/main.lua' to point at a different URL to open a
portal to somewhere else instead.
