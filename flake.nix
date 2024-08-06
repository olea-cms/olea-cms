{
  description = "OleaCMS OSS Content Management System";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells = {
        default = pkgs.mkShell {
	  nativeBuildInputs = [ pkgs.pkg-config ];
          buildInputs = with pkgs; [
            nil
            ((emacsPackagesFor emacs).emacsWithPackages (
              epkgs: [ epkgs.vterm ]
            ))
            ripgrep
            redmine
            stdenv.cc.cc.lib
            inotify-tools
            nodejs_20
            nodePackages.eslint
            nodePackages.typescript
            nodePackages.typescript-language-server
            glibc
            glibcLocales
            glibcLocalesUtf8
            firefox
            bun
            tree
            sqlite
      	    beekeeper-studio
            lazysql
            starship
          ];
          shellHook = ''
            echo ""
            echo "Welcome to the OleaCMS development environment"
            # eval "$(starship init bash)"
            LD=$CC
            export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"
            # ./zshi 'echo "in zsh"'
          '';
        };
      };
    });
}
