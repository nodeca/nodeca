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
│   ├─ settings/
│   │   └─ *.yml             # settings definitions
│   ├─ locales/
│   │   └─ <lang>.yml        # language translataions e.g. ru-RU.yml
│   ├─ themes/
│   │   └─ <id>.yml          # theme configs, e.g. theame-mobile.yml
│   └─ defaults.yml          # application config
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
are initialisation stages, models load and server methods invocation. Some hook
types are async, others are not.

_Examples for models and init_

    nodeca.hooks.models.on('forum.posts', function (model) { /* ... */ });
    nodeca.hooks.init.on('controllers-loaded', function (callback) { /* ... */ });

Server modules hooks are called `filters` and described in server modules spec.
