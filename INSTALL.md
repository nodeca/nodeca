installation instruction

## Install MongoDB/Redis (ubuntu/debian)

Requirements: node.js, mongodb, redis. Also, we recommend
[Hetzner](http://www.hetzner.de/en/hosting/produktmatrix/rootserver-produktmatrix/)
and [OVH](http://www.ovh.com/fr/serveurs_dedies/) for dedicated
server - very good price/quality ratio.


### MongoDB

http://docs.mongodb.org/manual/tutorial/install-mongodb-on-debian-or-ubuntu-linux/

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

Edit `/etc/redis/redis.conf`, restrict listening to `127.0.0.1` only.

    restart redis-server


## Other dependencies

You need GraphicsMagick or ImageMagick.

For ubuntu:

    sudo apt-get install graphicsmagick

You also need Cairo to generate identicons. If not installed (for example,
at server), read instructions for [node-canvas](https://github.com/Automattic/node-canvas#installation)
package.

For ubuntu:

    sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++


## Install node.js

Version 0.10+ required.

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

Copy **ALL** `*.example` files in root config folder to `*.yml`:

```bash
cp config/application.example.yml config/application.yml
cp config/database.example.yml config/database.yml
...
```

**Don't** touch files in `./config/examples` subfolders. Those are for education
purposes only.

Edit `application.yml` and `database.yml` to fit your environment.
For development - no changes usually needed.


## Init database

Apply migrations:

    ./nodeca.js migrate --all

If you need test data, apply seeds. List available:

    ./nodeca.js seed

Then use one by number:

    ./nodeca.js seed -n <NUMBER_1> -n <NUMBER_2>


## Run

In terminal (break with ctrl+c)

    ./nodeca.js server

Run with monitor (your dev location, autorestart when you make changes):

    make dev-server

Run on server (via `upstart`, learn script from `./etc` subfolder)

    start nodeca

Other commands:

    ./nodeca.js -h
