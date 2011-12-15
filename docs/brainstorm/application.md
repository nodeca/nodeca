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
├─ client/
│   └ <namespace>/
│       └─ /.../*.js                  # client-only parts of API tree
│
├─ server/
│   └─ <namespace>/
│       └─ /.../*.js                  # server-only parts of API tree (controllers)
│
├─ shared/
│   └ <namespace>/
│       └─ /.../*.js                  # server and client parts of API tree
│
├─ helpers/
│   └─ <namespace>/.../*.js           # api tree helpers
│
├─ public/
│   └─ <namespace>/*                  # static files + stylus templates
│
└─ index.js
```


Hooks
=====

TBD (how components can change default behaviour)


## Server-side view helpers

- `assetUrl(name)`
- `javascripts([namespace = 'all'])`
- `stylesheets([namespace = 'all'])`
