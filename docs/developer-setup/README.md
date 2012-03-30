Developers' Manuals
===================

## Prepare your environment

### Install node

Install build dependencies of node:

    apt-get build-dep libssl-dev curl
    git clone git://github.com/creationix/nvm.git ~/.nvm

Add following code into the end of your shell startup script (`.bashrc` for BASH):

    if [ -s "$HOME/.nvm/nvm.sh" ] ; then
        . ~/.nvm/nvm.sh # Loads NVM into a shell session.
    fi

Reopen terminal. Install node (long), and set default version:

    nvm install v0.6.14
    nvm alias default 0.6

### Install NDoc (documentation generator)

    npm install -g ndoc


## Read docs

- Coding Style - `./coding-style.md`
- `make` tasks - `./script-templates/Makefile`


## Continuous integration

All code in main repos should be "working" - it MUST pass tests, it MUST pass lint. If you
need experimeting - do it in your fork. Don't commit activated broken tests and not linted
sources to master tree. Usually, most repos have pre-built scripts to make checks:

- `make lint` - run lint on sources
- `make test` - run lint and then run tests

We use [Travis](http://http://travis-ci.org) to automatically run tests on all commits
If you received message, that your commit caused problems - fix that IMMEDIATELY. Repo managers
will be notified about all such fuckups and revert commit if not fixes soon.


## Github

Read docs about [issues syntax](https://github.com/blog/831-issues-2-0-the-next-generation). Since we
do code review, don't make commits, wich auto-close issues.
