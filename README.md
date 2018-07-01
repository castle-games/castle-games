# Ghost (name TBD)

Hello traveler! I'm Ghost. Don't worry, I'm not the scary kind of ghost, just a spirit that likes to
explore, probably like yourself. Anyways... You probably want to just try this thing out. So let's
do that!

## Serve a portal

Ghost can enter portals to show you things.

By default ghost enters the portal at 'http://0.0.0.0:8000/main.lua'. There's an example portal at
'./home' -- just go in there and run `python -m SimpleHTTPServer` to serve it. You can serve portals
however you want, it's just HTTP(S).

## Run Ghost

### macOS

Copy the '.framework' files in https://love2d.org/sdk/love-osx-frameworks-0.10.zip to
'/Library/Frameworks' if you haven't done that before. Open './love/platform/xcode/love.xcodeproj'
with Xcode and run the 'love-macosx' target.

### iOS

Open './love/platform/xcode/love.xcodeproj' with Xcode and run the 'love-ios' target.

