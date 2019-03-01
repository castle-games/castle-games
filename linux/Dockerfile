FROM ubuntu:18.04

# Love deps from https://love2d.org/wiki/Building_L%C3%96VE
RUN apt-get update && apt-get install -y build-essential autotools-dev automake libtool pkg-config libdevil-dev libfreetype6-dev libluajit-5.1-dev libphysfs-dev libsdl2-dev libopenal-dev libogg-dev libvorbis-dev libflac-dev libflac++-dev libmodplug-dev libmpg123-dev libmng-dev libturbojpeg libtheora-dev

RUN ln -s /usr/bin/make /usr/bin/gmake

RUN apt-get install -y cmake libcurl4-openssl-dev libboost-all-dev

# Installs OpenSSL to /usr/local/ssl
COPY openssl-1.0.2l.tar.gz openssl-1.0.2l.tar.gz
RUN tar -xf openssl-1.0.2l.tar.gz && cd openssl-1.0.2l && ./config shared && make install && cd .. && rm openssl-1.0.2l.tar.gz && rm -rf openssl-1.0.2l

WORKDIR /app
