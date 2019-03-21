# Upload an already-built Release build of Castle for Windows

set -e

if [ ! -d build/Release ]; then
  echo "Need to build first, aborting"
  exit 1
fi

GIT_HASH=$(git rev-parse HEAD)
WIN_BASE_VERSION=1
WIN_VERSION=$WIN_BASE_VERSION.$(git rev-list release-root..HEAD --count)

if [ ! -d castle-releases ]; then
  echo "Cloning 'castle-releases'..."
  git clone https://$CASTLE_GITHUB_TOKEN@github.com/castle-games/castle-releases.git
fi
cd castle-releases
echo "Pulling 'castle-releases'..."
git pull origin master
echo "Performing release..."
./castle-releases-win.exe win ../build/Release $WIN_VERSION ../extra/castle.ico