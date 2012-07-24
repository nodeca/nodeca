installation instruction

## Install MongoDB/Redis (ubuntu/debian)

### MongoDB

http://www.mongodb.org/display/DOCS/Ubuntu+and+Debian+packages

Follow instructions on link above. Then edit `/etc/mongodb.conf`,
add `bind_ip = 127.0.0.1` to the start.

    restart mongodb

If you don't use db auth - no mode actions needed. If you plan to use
it - create database and set login/password.


### Redis

https://launchpad.net/~rwky/+archive/redis

    sudo add-apt-repository ppa:rwky/redis
    # sudo add-apt-repository ppa:chris-lea/redis-server
    sudo apt-get update
    sudo apt-get install redis-server

Edit `/etc/redis/redis/conf`, restrict listening to `127.0.0.1` only.

    restart redis-server


## Install node.js

See [developper's manual](https://github.com/nodeca/nodeca/tree/master/docs/developer-setup)


## Install nodeca


### Bleeding age, server (read only)

Select this, if you like to see demo

    git clone git://github.com/nodeca/nodeca.git nodeca
    cd nodeca
    make pull-ro

`./etc` folder contains simple upstart config for fast deployment. It's not
secure, but allows easily install and switch node versions. That's convenient
for demo/development.


### Developpment (read/write, core team)

Select this, if you are in core development team, and has read/write access
to nodeca repos

    git clone git@github.com:nodeca/nodeca.git nodeca
    cd nodeca
    make pull


### Regular install (production deployment)

    npm install nodeca

(*) That will not work right now, since we did not released anything
Then, depending on your installation type, run:


## Configure

Rename **ALL** files in root config folder (example below):

    cp config/application.example.yml config/application.yml
    cp config/database.example.yml config/databse.yml

**Don't** touch files in `./config/examples` subfolders. Those are for education
purposes only.

Edit `application.yml` and `database.yml` to fit your environment.
For development - no changes usually needed.

## Init database

Apply migrations:

    ./nodeca.js migrate --all

If you need test data, apply seed. List available:

    ./nodeca.js seed

Then use one by number:

    ./nodeca.js seed -n <NUMBER>

## Run

    ./nodeca.js server

Run with monitor (autorestart when you make changes):

     make dev-server

Install supervisor globally, prior to do so: `npm install -g supervisor`

