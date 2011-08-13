Planing started. See [wiki](https://github.com/nodeca/nodeca/wiki) for details

[Screenshots](https://github.com/nodeca/nodeca-design)

Discussions
-----------

- [nodeca](https://groups.google.com/group/nodeca/) - english
- [nodeca-ru](https://groups.google.com/group/nodeca-ru/) - russian


Installation
------------

- `$ git clone git://github.com/nodeca/nodeca.git nodeca`
- `$ cd nodeca`
- `$ npm install`
- `$ cp config/application.example.yml config/application.yml`
- `$ cp config/database.example.yml config/databse.yml`
- edit `application.yml` and `database.yml` to fit your environment
- `make app-start`


### Known Issues

By some reason `npm` might not work as expected - when there are lots of
dependencies (like in nodeca-lib) it might die with timout error because of
awesome crazy asynchronous model...

In this case you will need to install packages manually.
