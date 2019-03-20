# Build a Release build of Castle for Windows

set -e

rm -rf build/Release
./configure_cmake.sh
cmake.exe --build build --config Release
