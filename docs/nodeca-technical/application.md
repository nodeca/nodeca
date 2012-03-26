Application
-----------


Dir Structure
=============

Directores below are processed automaticallty during init.

```
.
├─ models/
│   └─ *.js
│
├─ stores/                  # setting stores
│   └─ *.js
│
├─ views/theme-<id1>/.../   # similar to server method path
│   ├─ _*.jade              # underscore means `partials`, not included in bundle
│   └─ *.jade
│
├─ config/
│   ├─ /.../*.yml
│   └─ *.yml
│
├─ client/                   # client-side API tree functions, mapped to `nodeca.client.<...>`
│   └─ <namespace>/
│       └─ /.../*.js
│
├─ server/                   # server-side API tree functions, mapped to `nodeca.server.<...>`
│   └─ <namespace>/
│       └─ /.../*.js
│
├─ shared/                   # shared API tree code for both server & client, mapped to `nodeca.shared.<...>`
│   └─ /.../*.js
│
├─ assets/                   # static files (images, stylus templates, jQuery & plugins)
│   ├─ /.../*.*              # Any structure, except <theme-*>
│   ├─ theme-<id1>/*.*       # Theme files
│   └─ ...
│   
├─ migrations/
│   ├─  *.js                 # migration step
│   └─ ...                    
│
└─ index.js
```


API Tree
========

Most components are available via `nodeca` object as nested parts.
Details available in other files.


Namespaces
==========

Namespaces are used to minimize client-side code. For example, regular users don't need
to load admin templates, functions and translations. We use component name as it's namespace.

Physically, namespace is a directory.

There are special `common` namespace for resources, that should be available everywhere.
This namespace will be loaded to client for all pages.


Hooks
=====

Hooks are used to attach external handlers on different modules. Most used cases
are initialisation stages, models load and server methods invocation.

_Examples for models and init_

    nodeca.hooks.models.on('forum.posts', function (model, callback) { /* ... */ });
    nodeca.hooks.init.before('forum.posts', function (callback) { /* ... */ });
    nodeca.hooks.init.after('forum.posts', function (callback) { /* ... */ });

Server modules hooks are called `filters` and described in server modules spec.

Migration scripts
=================

Migrations are stored as files in the `migrations` directory, one per file.
The name of the file is of the form YYYYMMDDHHMMSS\_migration\_name.rb, that is 
to say a UTC timestamp identifying the migration followed by an underscore followed 
by the name of the migration.

Each migration script must have exported method `up` with single callback argument.

Example:

``` javascript

module.exports.up = function(cb) {
  my_model = new global.nodeca.models.my_model(/* some data */);

  my_model.save(function (err) {
    cb(err);
  });
}

```

Migrations run from old to new.

In migration available all existing models.

File tree example.

```
.
├─ migrate/
│   ├─ 20110919181104_create_sections.js
│   └─ 20120103183744_create_threads.js
│
```

Cli scripts
===========

1. Migrator script `bin/migrate`. Scripts runs migrations in series for each application, one at time, respecting the order of applications given in config.
