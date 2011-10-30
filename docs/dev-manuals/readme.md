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


## Coding Style

See coding-style.md
