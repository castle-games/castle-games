LOCAL_PATH:= $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE    := libghostextensions
LOCAL_CFLAGS    :=

LOCAL_CPPFLAGS  := ${LOCAL_CFLAGS}

LOCAL_C_INCLUDES  :=  \
	${LOCAL_PATH}/../LuaJIT-2.1/src \
	${LOCAL_PATH}/../../../../../../openssl/include

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
	${LOCAL_PATH}/lsqlite3/sqlite3.c )

LOCAL_STATIC_LIBRARIES := ssl_static crypto_static

include $(BUILD_STATIC_LIBRARY)
