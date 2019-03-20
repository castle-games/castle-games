# Run CMake to configure the project for building

case "$(uname -s)" in
	Linux*) mdFlag='/MD';;
	MINGW*) mdFlag='//MD';;
esac

cmake.exe -DMEGA_LOVE=../love \
	-DOPENSSL_ROOT_DIR=../openssl/openssl-1.0.2l-vs2017 -DOPENSSL_USE_STATIC_LIBS=TRUE -DOPENSSL_MSVC_STATIC_RT=TRUE \
	-DCEF_RUNTIME_LIBRARY_FLAG=$mdFlag \
	-G "Visual Studio 15" -H. -Bbuild
