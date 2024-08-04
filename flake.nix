{
  description = "OleaCMS monorepo with backend and frontend";

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
          buildInputs = [
            pkgs.emacs
            pkgs.browsh
            pkgs.stdenv.cc.cc.lib
            pkgs.inotify-tools
            pkgs.nodejs_20
            pkgs.nodePackages.eslint
            pkgs.nodePackages.typescript
            pkgs.nodePackages.typescript-language-server
            pkgs.glibc
            pkgs.firefox
            pkgs.bun
            # pkgs.pnpm
            pkgs.tree
            pkgs.sqlite
      	    pkgs.beekeeper-studio
            pkgs.lazysql
            pkgs.starship
          ];
          shellHook = ''
            echo ""
            echo "Welcome to the OleaCMS backend development environment"
            # eval "$(starship init bash)"
            LD=$CC
            export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"
            # ./zshi 'echo "in zsh"'
          '';
        };
      };
    });
}
