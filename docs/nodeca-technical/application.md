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


Configuration Files
===================

All configuration files are kept under `./config` directory. There are no any
restrictions on naming of these files. Each file should contain a configuration
tree starting from the root node, in other words their paths are not respected.

All trees are merged together. Values from main application config are taking
precedence. There's an exact list of first-level keys available in config files
other than those keys will be ignored.

- *applications*
- *i18n*
- *theme_schemas*
- *setting_schemas*
- *routes*
- *direct_invocators*
- *redirects*
- *mount*
- *settings*
- *locales*
- *themes*
- *database*
- *listen*

See `config/*.example` of nodeca and config files of nodeca.core for details.


Per-environment configurations
------------------------------

You may also specify a per-environment configuration. For this purposes we allow
to specify environment names as first-level sections (real config becomes
nested) with caret (`^`) prefix.

NOTICE that sections described on firs-level (without environment) arec
onsidered as `general`, so they are pplied for any environment. Also,
environment-specified options tak precedence over general.

In the example below, `listen` will become:

- when `NODECA_ENV=production`: `{host: nodeca.org, port: 80}`
- when `NODECA_ENV=development`: `{host: localhost, port: 8080}`
- else: `{host: localhost, port: 80}`

*Example:*

``` yaml
listen:                   # applied to any environment
  host: localhost
  port: 80

^production:              # applied to `production` environment
  listen:
    host: nodeca.org
    port: 80

^development:             # applied to `development` environment
  listen:
    port: 8080
```
