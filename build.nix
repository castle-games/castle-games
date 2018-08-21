with (import <nixpkgs> {});

let
  pname = "ghost";
  version = "0.0.1";
  freetype = (import <nixos-unstable> {}).freetype;
  libcef = (import <nixos-unstable> {}).libcef;
in

stdenv.mkDerivation rec {
  name = "${pname}-${version}";
  src = ../ghost;

  nativeBuildInputs = [ cmake ];
  buildInputs = [
    SDL2 libGLU_combined openal luajit libdevil freetype physfs libmodplug mpg123
    libogg libvorbis libtheora openssl libcef
  ];

  preConfigure = ''
    cd love
    mkdir -p build
    for i in ${libcef}/share/cef/*; do
      ln -s $i build/
    done
  '';

  installPhase = ''
    mkdir -p $out/bin
    cp love $out/bin/ghost
  '';

  meta = {
    # TODO(nikki): Fill this in later!
    #homepage = http://love2d.org;
    #description = "A Lua-based 2D game engine/scripting language";
    #license = stdenv.lib.licenses.zlib;
    #platforms = stdenv.lib.platforms.linux;
    #maintainers = [ stdenv.lib.maintainers.raskin ];
  };
}
