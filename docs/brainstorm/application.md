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
├─ views/<controller_name>/           # sub-dir per controller
│   ├─ _*.jade                        # partials.js
│   └─ *.jade
│
├─ config/
│   ├─ settings/
│   │   └─ *.yml                      # settings definitions
│   ├─ locales/
│   │   └─ <lang>.yml                 # language translataions e.g. ru.yml
│   ├─ themes/
│   │   └─ <id>.yml                   # theme configs, e.g. theame-mobile.yml
│   └─ defaults.yml                   # application config
│
├─ client/                            # client-side API tree functions, mapped to `nodeca.client.<...>`
│   └─ <namespace>/
│       └─ /.../*.js
│
├─ server/                            # server-side API tree functions, mapped to `nodeca.server.<...>`
│   └─ <namespace>/
│       └─ /.../*.js
│
├─ shared/                            # shared API tree code for both server & client, mapped to `nodeca.shared.<...>`
│   └─ <namespace>/
│       └─ /.../*.js
│
├─ static/                            # static files (images, stylus templates, jQuery & plugins)
│   ├─ /.../*.*                       # Any structure, except <theme-*>
│   ├─ theme-<id1>/*.*                # Theme files
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


Server-side view helpers
========================

TBD (helpers that used to produce asset URLs, bunches of script includes etc)

Client Config
=============

Client config is generated dynamically. It helps to properly cache static data in local store,
and refresh app on server upgrade.

``` javascript
{
  version:      "1.0.0"                     // Nodeca version
  assets_root:  "//nodeca.com/assets/"      // Root URL for assets
  debug:        true,                       // (optional) Disable caches & enable console.logs
  language:     "ru_RU"
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
}
```
