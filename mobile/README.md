# Castle Mobile

People are on their phones a lot. Now Castle will be too.

## Run

For best results make sure your computer and phone are on the same local area network.

### Common

Make sure you have [Expo](https://docs.expo.io/versions/latest/introduction/installation). 👀

In 'mobile/':

- `npm i`
- `expo r --lan` (or `expo r --tunnel` if your computer and phone aren't on the same local area network).

Keep this running. It will show logs.

### iOS

Do 'Common' above first (it will write a file telling the iOS code how to load the JavaScript from your computer).

Make sure you have Xcode. Open the file ending in '.xcworkspace' under 'ios/'. *(You may have to click on 'castle' in the left sidebar (hit Cmd + 0 if it's not visible) then set up some code-signing certificate stuff -- like using your personal subscription. I have it on my personal iOS developer subscription right now, so that's why. I'll discuss with @terribleben and get a team certificate set up.)* Then hit Cmd + R.
