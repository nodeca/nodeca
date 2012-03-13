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
│   ├─ <app_version>/        # app version
│   │   └─ *[.<priority>].js # migration step
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

Migrations for each version located in separate folders. Optionally script name 
can contain run priority. 

Also in migration available all existing models.

File tree example.

```
.
├─ migrations/
│   ├─ 0.0.1/           # app version
│   │   ├─ foo.js       # scripts without priority, default value 10
│   │   └─ bar.js       #
│   │ 
│   ├─ 0.1.2/           # 
│   │   ├─ foo.10.js    # use prioryty in migration script name
│   │   └─ bar.20.js    # priorities are sorted by ascending order
│   │ 
```

Cli scripts
===========

1. Migrate script `bin/migrate`. Script run all migrations for each versions of used packages.
