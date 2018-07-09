cmake -DMEGA_LOVE=../love \
	-DOPENSSL_ROOT_DIR=../openssl/openssl-1.0.2l-vs2013 -DOPENSSL_USE_STATIC_LIBS=TRUE -DOPENSSL_MSVC_STATIC_RT=TRUE \
	-G "Visual Studio 12" -H. -Bbuild
# cmake --build build --target love/love --config Release
