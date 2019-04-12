#!/bin/sh

install_name_tool -change /usr/local/opt/ffmpeg/lib/libavcodec.58.dylib @rpath/libavcodec.58.dylib bin/libobs.0.dylib
install_name_tool -change /usr/local/opt/ffmpeg/lib/libavformat.58.dylib @rpath/libavformat.58.dylib bin/libobs.0.dylib
install_name_tool -change /usr/local/opt/ffmpeg/lib/libavutil.56.dylib @rpath/libavutil.56.dylib bin/libobs.0.dylib
install_name_tool -change /usr/local/opt/ffmpeg/lib/libswscale.5.dylib @rpath/libswscale.5.dylib bin/libobs.0.dylib
install_name_tool -change /usr/local/opt/ffmpeg/lib/libswresample.3.dylib @rpath/libswresample.3.dylib bin/libobs.0.dylib
install_name_tool -change /usr/lib/libz.1.dylib @rpath/libz.1.dylib bin/libobs.0.dylib
