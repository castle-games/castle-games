LOCAL_PATH:= $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE    := libghostextensions
LOCAL_CFLAGS    := -fvisibility=default 

LOCAL_CPPFLAGS  := ${LOCAL_CFLAGS}

LOCAL_C_INCLUDES  :=  \
	${LOCAL_PATH}/../LuaJIT-2.1/src \
	${LOCAL_PATH}/../../../../../../openssl/include \
	${LOCAL_PATH}/tove2d/src/thirdparty/fp16/include

LOCAL_SRC_FILES := \
	$(subst $(LOCAL_PATH)/,,\
	${LOCAL_PATH}/lpeg/lpcap.c \
	${LOCAL_PATH}/lpeg/lpcode.c \
	${LOCAL_PATH}/lpeg/lpvm.c \
	${LOCAL_PATH}/lpeg/lpprint.c \
	${LOCAL_PATH}/lpeg/lptree.c \
	${LOCAL_PATH}/luacrypto/src/lcrypto.c \
	${LOCAL_PATH}/luasec/src/config.c \
	${LOCAL_PATH}/luasec/src/ec.c \
	${LOCAL_PATH}/luasec/src/context.c \
	${LOCAL_PATH}/luasec/src/ssl.c \
	${LOCAL_PATH}/luasec/src/x509.c \
	${LOCAL_PATH}/lua-cjson/fpconv.c \
	${LOCAL_PATH}/lua-cjson/strbuf.c \
	${LOCAL_PATH}/lua-cjson/lua_cjson.c \
	${LOCAL_PATH}/lua-marshal/lmarshal.c \
	${LOCAL_PATH}/lsqlite3/lsqlite3.c \
	${LOCAL_PATH}/lsqlite3/sqlite3.c \
	${LOCAL_PATH}/tove2d/src/cpp/version.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/interface/api.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/graphics.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/nsvg.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/paint.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/path.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/references.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/subpath.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/mesh/flatten.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/mesh/mesh.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/mesh/meshifier.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/mesh/partition.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/mesh/triangles.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/gpux/curve_data.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/gpux/geometry_data.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/gpux/geometry_feed.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/shader/gen.cpp \
	${LOCAL_PATH}/tove2d/src/thirdparty/clipper.cpp \
	${LOCAL_PATH}/tove2d/src/thirdparty/polypartition/src/polypartition.cpp \
	${LOCAL_PATH}/tove2d/src/thirdparty/tinyxml2/tinyxml2.cpp \
	${LOCAL_PATH}/tove2d/src/cpp/warn.cpp \
	)

LOCAL_STATIC_LIBRARIES := ssl_static crypto_static

include $(BUILD_STATIC_LIBRARY)
