Developers' Manuals
===================

Read recommendations [for beginners](for-beginners.md) prior to start.

## Prepare your environment

### Install node

Install packages:

    sudo apt-get install build-essential git libssl-dev curl
    git clone git://github.com/creationix/nvm.git ~/.nvm

Reopen terminal. Install node and set default version:

    nvm install 4
    nvm alias default 4

### Install global node modules, used sometime:

    npm install -g ndoc police jshint


## Read docs

- Coding Style - `./coding-style.md`
- `make` tasks - `./script-templates/Makefile`


## Continuous integration

All code in main repos should be "working" - it MUST pass tests, it MUST pass lint. If you
need experimeting - do it in your fork. Don't commit activated broken tests and not linted
sources to master tree. Usually, most repos have pre-built scripts to make checks:

- `make lint` - run lint on sources
- `make test` - run lint and then run tests

We use [Travis](http://travis-ci.org) to automatically run tests on all commits
If you receive message, that your commit caused problems - postpone everything
and fix that IMMEDIATELY. Big boss will be notified about fuckups, and will check
that you apply fixes ASAP.


## Github

Read docs about [issues syntax](https://github.com/blog/831-issues-2-0-the-next-generation). Since we do code review, don't make commits, wich auto-close issues.
