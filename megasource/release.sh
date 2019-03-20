# Build and upload a new version of Castle for Windows

set -e

if [[ -n $(git status --porcelain) ]]; then
  echo "Tree is dirty, aborting"
  exit 1
fi

git fetch --tags --prune
GIT_HASH=$(git rev-parse HEAD)
WIN_BASE_VERSION=1
WIN_VERSION=$WIN_BASE_VERSION.$(git rev-list release-root..HEAD --count)

rm -rf build/Release
./run_cmake.sh
cmake.exe --build build --config Release

echo -e "\n\b\bCreated 'Castle-$WIN_VERSION.zip'"

if [ ! -d castle-releases ]; then
  echo "Cloning 'castle-releases'..."
  git clone https://$CASTLE_GITHUB_TOKEN@github.com/castle-games/castle-releases.git
fi
cd castle-releases
echo "Pulling 'castle-releases'..."
git pull origin master
echo "Performing release..."
./castle-releases-win.exe win ../build/Release $WIN_VERSION ../extra/castle.ico
