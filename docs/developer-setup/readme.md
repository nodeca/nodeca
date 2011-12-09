Developers' Manuals
===================

## Prepare your environment

### Install node

Install build dependencies of node:

    # apg-get build-dep nodejs
    # git clone git://github.com/creationix/nvm.git ~/.nvm

Add following code into the end of your shell startup script (`.bashrc` for BASH):

    if [ -s "$HOME/.nvm/nvm.sh" ] ; then
        . ~/.nvm/nvm.sh # Loads NVM into a shell session.
    fi

Install node (long), and set default version:

    # nvm install v0.6.5
    # nvm alias default v0.6.5

### Install NDoc (documentation generator)

    # npm install -g ndoc

## Read docs

- Conding Style - `./coding-style.md`
- `make` tasks - `./script-templates/Makefile`

## Continuous integration

We use [Travis](http://http://travis-ci.org) to automatically run tests on all commits
If you received message, that your commit caused problems - fix that IMMEDIATELY.

Don't commit activated broken tests and not linted sources in master tree.
