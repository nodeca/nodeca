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
├─ stores/
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


API Tree
========

Most components are available via `nodeca` object as nested parts. Details available in other files.
Here is short memo to see all sections at once:

```
nodeca
  client                  # client methods
  server                  # server method
  shared                  # available on both client & server, mostly for helpers
  permissions             # access rules
  filters                 # hooks for server methods (mostly to attach access rules)
  router                  # router
  settings                # settings accessor (get/set, not tree)
  config                  # see config description above.
```


Client Config
=============

Client config is generated in bundle + dynamically. It helps to properly cache
static data in local store, and refresh app on server upgrade.

``` javascript
{
  version:      "1.0.0"                     // Nodeca version
  assets_root:  "//nodeca.com/assets/"      // Root URL for assets
  crc: {                                    // Resources CRCs. If differ from local cache - need reload
    phrases: {
      forum:    "crc1"
      blogs:    "crc2"
      groups:   "crc3"
      admin:    "crc4"
    }
    templates: {
      forum:    "crc5"
      blogs:    "crc6"
      groups:   "crc7"
      admin:    "crc8"
    }
  }
  routes: {                                 // router configucation (from .yml files)
  }

  // Dynamically added for each client, via inline JS
  debug:        true,                       // (optional) Disable caches & enable console.logs
  language:     "ru_RU"
}
```

