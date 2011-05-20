Developers' Manuals
===================

To start development easier you will need:

- git
- [node](https://github.com/joyent/node)
- [nvm](https://github.com/creationix/nvm)
- [pdoc](https://github.com/tobie/pdoc)


## Prepare your environment

### Install git

Under Debian-based distros, execute (with rights of super-user):

    # apt-get install git

### Install nvm and node

Under normla user, clone `nvm` into your $HOME dir:

    $ git clone git://github.com/creationix/nvm.git ~/.nvm

Add following code into the end of your shell startup script (`.bashrc` for BASH):

    if [ -s "$HOME/.nvm/nvm.sh" ] ; then
        . ~/.nvm/nvm.sh # Loads NVM into a shell session.
        nvm use stable  # Presets `stable` node by default.
    fi

Open new shell session. Check that `nvm` was successfully loaded:

    $ type nvm | head -n1
    nvm is a function

In most cases you will need install development tools in order to build `node`.
On Debian-based systems you may try:

    # apt-get build-dep node

Synchronize list of available node versions and install the one you need (e.g.
stable):

    $ nvm sync
    $ nvm install stable

#### List of node build dependencies

In order to build (install) node you will need to have these packages installed:

    # apt-get install devscripts cdbs debhelper dh-buildinfo python libev-dev \
                      libv8-dev scons libc-ares-dev binutils libssl-dev \
                      pkg-config bash-completion curl

### Install Ruby and PDoc

The easiest way to install Ruby is to use package manager:

    # apt-get install ruby rubygems

Once you have ruby and rubygems installed, install `pdoc` gem:

    # gem install pdoc


#### Installing PDoc

At the moment of writing this README, `pdoc`'s gem in the main repo is outdated
and works very strange. So, probably you will need to build and install your
own gem. That's much more easier than it sounds:

    $ git clone git://github.com/tobie/pdoc.git
    $ git checkout 0.2.1
    $ gem build ./pdoc.gemspec
    $ gem install ./pdoc-0.2.1.gem


## Start developing

### Coding Style

We use [Google's JavaScript coding style](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
as our coding standards.

Code documentation should be written in format of [PDoc](http://pdoc.com). See
[PDoc Syntax](http://pdoc.org/syntax.html) for details about it.

You should document ALL public visible methods and properties that you are
assigning to the object|function|whatever. Functions and variables which are
out of visible scope should be documented inline (with double slash) in
freestyle (but keep in mind that this part of code probably will read a human
after you), e.g.:

    // returns something uselfull from the object
    var get_usefull = function (obj) {
      // ...
    }


### Using Makefile

We are using [Makefile](scripts/Makefile) and set of [helper
scripts](scripts/support/) for repeated tasks.


In order to run test suites for your project execute:

    $ make test

In order to regenerate API docs:

    $ make docs

In order to update `gh-pages` with latest API docs:

    $ make gh-pages
