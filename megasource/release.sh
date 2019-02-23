set -e
rm -rf build/Release
./run_cmake.sh
cmake.exe --build build --config Release

cd installer
cmake.exe -H. -Bbuild
cmake.exe --build build --target PACKAGE_AND_MOVE --config Release
cd ..
