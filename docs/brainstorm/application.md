Dir Structure
=============

Directores below are processed automaticallty during init.

```
.
├─ models/
│   └─ *.js
│
├─ stores/
│   └─ *.js
│
├─ views/<controller_name>/           # sub-dir per controller
│   ├─ _*.jade                        # partials.js
│   └─ *.jade
│
├─ config/
│   ├─ settings/
│   │   └─ *.yml                      # settings definitions
│   ├─ locales/
│   │   └─ <lang>.yml                 # language translataions e.g. ru.yml
│   └─ defaults.yml                   # application config
│
├─ client/                            # client-side API tree functions, mapped to `nodeca.client.<...>`
│   └ <namespace>/
│       └─ /.../*.js
│
├─ server/                            # server-side API tree functions, mapped to `nodeca.server.<...>`
│   └─ <namespace>/
│       └─ /.../*.js
│
├─ shared/                            # shared API tree code for both server & client, mapped to `nodeca.shared.<...>`
│   └ <namespace>/
│       └─ /.../*.js
│
├─ static/                            # static files (images, stylus templates, jQuery & plugins)
│   └─ <namespace>/*
│
└─ index.js
```


Namespaces
==========

Namespaces are used to minimize client-side code. For example, regular users don't need
to load admin templates, functions and translations. We use component name as it's namespace.

Physically, namespace is a directory.

There are special `common` namespace for resources, that should be available everywhere.
This namespace will be loaded to client for all pages.


Hooks
=====

TBD (how components can change default behaviour)


## Server-side view helpers

- `assetUrl(name)`
- `javascripts([namespace = 'all'])`
- `stylesheets([namespace = 'all'])`
