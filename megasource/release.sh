set -e
rm -rf build/Release
./run_cmake.sh
cmake --build build --config Release

cd installer
cmake -H. -Bbuild
cmake --build build --target PACKAGE_AND_MOVE --config Release
cd ..
