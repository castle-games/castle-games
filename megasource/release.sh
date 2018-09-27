rm -rf build/Release
./run_cmake.sh
cmake --build build --config Release

rm castle.zip
cd build/Release
../../tools/7za.exe a -r ../../castle.zip -w . -mem=AES256
cd ..