Download https://www.boost.org/users/history/version_1_67_0.html and extract to boost_1_67_0
`cd boost_1_67_0/`
`./bootstrap.sh --prefix=../build`
`./b2 install --with-filesystem --with-date_time --with-regex --with-chrono --with-thread link=static runtime-link=static`

- Under the `ghost.xcodeproj` file tree in Xcode, under `vendor`, add `boost` as a folder reference.
- Make sure header search paths and library search paths include boost directory (should already be true).
- Make sure the boost `.a` files are added as linked Libraries under `ghost-macosx/General`.

Current config:

```
    - atomic                   : not building
    - chrono                   : building
    - container                : not building
    - context                  : not building
    - contract                 : not building
    - coroutine                : not building
    - date_time                : building
    - exception                : not building
    - fiber                    : not building
    - filesystem               : building
    - graph                    : not building
    - graph_parallel           : not building
    - iostreams                : not building
    - locale                   : not building
    - log                      : not building
    - math                     : not building
    - mpi                      : not building
    - program_options          : not building
    - python                   : not building
    - random                   : not building
    - regex                    : building
    - serialization            : not building
    - signals                  : not building
    - stacktrace               : not building
    - system                   : not building
    - test                     : not building
    - thread                   : building
    - timer                    : not building
    - type_erasure             : not building
    - wave                     : not building
```
