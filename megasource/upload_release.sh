set -e

cd ..

if [ ! -d "ghost-releases" ]; then
  git clone git@github.com:expo/ghost-releases.git
fi

GHOST_COMMIT_HASH="$(git rev-parse --short HEAD)"

cd ghost-releases
git pull origin master

cp ../megasource/CastleSetup.exe .

git commit -a -m "windows: new release from $GHOST_COMMIT_HASH"
git push origin master