Developers' Manuals
===================

## Prepare your environment

### Install node

Install build dependencies of node:

    # apg-get build-dep nodejs

We use [nvm](https://github.com/creationix/nvm) for manipulating node instances.
Install `nvm` into your $HOME dir:

    $ git clone git://github.com/creationix/nvm.git ~/.nvm

Add following code into the end of your shell startup script (`.bashrc` for BASH):

    if [ -s "$HOME/.nvm/nvm.sh" ] ; then
        . ~/.nvm/nvm.sh # Loads NVM into a shell session.
        nvm use stable  # Presets `stable` node by default.
    fi

Open new shell session. Check that `nvm` was successfully loaded:

    $ type nvm | head -n1
    nvm is a function

If everything is OK, synchronize list of available node versions and install the
one you need (e.g. stable):

    $ nvm sync
    $ nvm install stable


### Install PDoc

Install Ruby and RubyGems:

    # apt-get install ruby rubygems

Build and install PDoc gem

    $ git clone git://github.com/tobie/pdoc.git
    $ git checkout 0.2.1
    $ gem build ./pdoc.gemspec
    # gem install ./pdoc-0.2.1.gem


## Scripts and functions

Under [scripts](scripts/) directory you will find scripts and utilities for
making your dev-days a little bit easier:

- [Makefile](scripts/Makefile) contains often-used tasks:
  - `make test` runs all test suites
  - `make docs` updates API documentation in `./doc/`
  - `make gh-pages` updates gh-pages branch with latest API documentation
- [support/generate-docs.rb](scripts/support/generate-docs.rb) PDoc runner

Simply copy contents of [scripts](scripts/) directory into root of your new
project to make your life shiner.

Once you put scripts into your project's root, open `support/generate-docs.rb`
and edit some variables to fit your project:

    PROJECT_NAME="nodeca"
    GITHUB_NAME="nodeca/nodeca"

For example if you are developing `nodeca-blogs` and your repo is available on
GitHub as `https://github.com/ixti/nodeca-blogs/` set variables as:

    PROJECT_NAME="nodeca-blogs"
    GITHUB_NAME="ixti/nodeca-blogs"
