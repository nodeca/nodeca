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

    git clone git://github.com/nodeca/nodeca.git nodeca
    cd nodeca

Then, depending on your installation type, run:

- `npm install` for production
- `make dev-setup` for development

For development, git repos vill be used instead of npm modules.
Now it's time to define configs

    cp config/application.example.yml config/application.yml
    cp config/database.example.yml config/databse.yml

Edit `application.yml` and `database.yml` to fit your environment.
For development, no changes usually needed.

Init Dstabase:

    ./bin/migrate

Now you can run nodeca:

    make app-start

