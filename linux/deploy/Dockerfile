FROM castle-dev

RUN mkdir -p /local/game/log

WORKDIR /local/game

COPY build build

ENTRYPOINT ["./build/castle-server"]
