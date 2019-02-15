#!/bin/sh

# Produces 'Castle.pkg' from sources

GIT_HASH=$(git rev-parse HEAD)

# Need a monotonically increasing version name for macOS to upgrade the app properly
MACOS_BASE_VERSION=1
MACOS_VERSION=$MACOS_BASE_VERSION.$(git rev-list release-root..HEAD --count)

# Write version names to sources and make temporary archive build
sed -i '' "s/GIT_HASH_UNSET/$GIT_HASH/" ../common/ghost.h
sed -i '' "s/MACOS_VERSION_UNSET/$MACOS_VERSION/" Supporting/ghost-macosx.plist
rm -rf archive.xcarchive
xcodebuild -project ghost.xcodeproj -config Release -scheme ghost-macosx -archivePath ./archive archive

# Create '.pkg' installer
rm -rf pkg-root
mkdir -p pkg-root/Applications
mv archive.xcarchive/Products/Applications/Castle.app pkg-root/Applications/
pkgbuild --root pkg-root --component-plist Supporting/ghost-pkg.plist --identifier io.playcastle.castle --version $MACOS_VERSION Castle.pkg
rm -rf pkg-root

# Delete temporary archive build
rm -rf archive.xcarchive

