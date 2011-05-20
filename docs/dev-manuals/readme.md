Developers' Manuals
===================

To start development easier you will need:

- git
- [node](https://github.com/joyent/node)
- [nvm](https://github.com/creationix/nvm)
- [pdoc](https://github.com/tobie/pdoc)


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


## Coding Style

We use [Google's JavaScript coding style](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
as our coding standards.

Code documentation should be written in format of [PDoc](http://pdoc.com). See
[PDoc Syntax](http://pdoc.org/syntax.html) for details about it.

You should document ANY method|property that might be reached from the outside.
You may want to mark property as _protected_, but make sure to document it in
order to avoid any collisions and misunderstandings. E.g.:

    /**
     *  Human#__heart__ -> Heart
     *
     *  **PRIVATE**
     *  Very important part of instance.
     **/

Do not document (with PDoc) anything that is not reachable outside. Comment them
inline with reasonable comments:

    Human.prototype.think = funtion think() {
      // Instace of [[Idea]]
      var idea;
    };

Do not document HOW (algorithm) function works. Document WHAT does it doing.
For example, this documentation is shit:

    /**
     *  Human#walk(steps) -> Void
     *
     *  Get active leg, get control over the leg, turn it to the new position,
     *  switch active leg, reduce amount of steps by one, repeat until steps
     *  counter reach zero.
     **/

Instead of literal explanation of source code (who needs to know the algorithm
can read source code without any problem), describe what it does:

    /**
     *  Human#walk(steps) -> Void
     *
     *  Moves instance forward on specified amount of `steps`.
     */

If your method use some formula, put it into the description:

    /**
     *  log(number[, base = 10]) -> Number
     *  - number (Number): Logarithm number
     *  - base (Number): Base of logarithm
     *
     *  Returns logarithm of `numer` to the `base`.
     *
     *  ##### Formula
     *
     *  base^x = number
     **/


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
