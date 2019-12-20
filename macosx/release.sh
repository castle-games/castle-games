#!/bin/sh

# Build and upload a new version of Castle for macOS
# Options:
#   --no-upload: Don't upload, just build.

set -e

if [[ -n $(git status --porcelain) ]]; then
  echo "Tree is dirty, aborting"
  exit 1
fi

git fetch --tags --prune
GIT_HASH=$(git rev-parse HEAD)
MACOS_BASE_VERSION=1
MACOS_VERSION=$MACOS_BASE_VERSION.$(git rev-list release-root..HEAD --count)

/usr/libexec/PlistBuddy -c "Set GHGitHash $GIT_HASH" Supporting/ghost-macosx.plist
/usr/libexec/PlistBuddy -c "Set CFBundleVersion $MACOS_VERSION" Supporting/ghost-macosx.plist
/usr/libexec/PlistBuddy -c "Set CFBundleShortVersionString $MACOS_VERSION" Supporting/ghost-macosx.plist

rm -rf archive.xcarchive
xcodebuild -project ghost.xcodeproj -config Release -scheme ghost-macosx -archivePath ./archive archive | xcpretty

if [ -z "$TEMP_CERT_PATH" ]; then
    TEMP_CERT_PATH=/private/tmp/castle/castle-codesigning-certs
fi

if [ ! -d $TEMP_CERT_PATH ]; then
    git clone https://$CASTLE_GITHUB_TOKEN@github.com/castle-games/castle-codesigning-certs.git $TEMP_CERT_PATH
fi
pushd $TEMP_CERT_PATH
echo "Pulling 'castle-codesigning-certs'..."
git pull origin master
popd

echo "Begin codesigning..."
./tools/codesign-archive.sh archive.xcarchive $TEMP_CERT_PATH/macos/CastleDeveloperID.p12

APP_PATH=archive.xcarchive/Products/Applications/Castle.app
ZIP_PATH=Castle-$MACOS_VERSION.zip

echo "Cleaning up source plists..."

/usr/libexec/PlistBuddy -c "Set GHGitHash GIT_HASH_UNSET" Supporting/ghost-macosx.plist
/usr/libexec/PlistBuddy -c "Set CFBundleVersion VERSION_UNSET" Supporting/ghost-macosx.plist
/usr/libexec/PlistBuddy -c "Set CFBundleShortVersionString VERSION_UNSET" Supporting/ghost-macosx.plist

# notarize the archive
echo "Begin notarization..."
./tools/notarize-archive.sh $APP_PATH

# verify gatekeeper, including notarization
./tools/verify-gatekeeper.sh $APP_PATH

echo "Zipping and cleaning up archive..."
ditto -c -k --sequesterRsrc --keepParent $APP_PATH $ZIP_PATH
rm -rf archive.xcarchive

echo -e "\n\b\bCreated '$ZIP_PATH'"

# --no-upload prevents actually uploading the release
if [[ "$*" == *--no-upload* ]]
then
    echo "--no-upload flag provided, succeeded without uploading"
    exit 0
fi

if [ ! -d castle-releases ]; then
  echo "Cloning 'castle-releases'..."
  git clone https://$CASTLE_GITHUB_TOKEN@github.com/castle-games/castle-releases.git
fi
cd castle-releases
echo "Pulling 'castle-releases'..."
git pull origin master
echo "Performing release..."
./castle-releases-macos mac ../$ZIP_PATH
