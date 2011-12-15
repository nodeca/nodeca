Client Bundler
--------------

### Stage 1. Application initialization

On this stage we initialize all sub-applications, run hooks, load i18n and
prepare full API tree.

### Stage 2. Prepare server wrappers

On this stage we prepare wrapper function for each `nodeca.server` method to be
exported as part of client API tree.

### Stage 3. Flush API tree for the client

Flushing API tree to the filesystem:

```
.
├─ <namespace>/
│   ├─ client.js        # development: nodeca.<namespace>.client
│   ├─ server.js        # development: nodeca.<namespace>.server
│   ├─ shared.js        # development: nodeca.<namespace>.shared
│   ├─ bundle.js        # production: nodeca.<namespace>.*
│   ├─ i18n/
│   │   └─ <lang>.js    # nodeca.<namespace>.i18n.<lang>
│   └─ views/
│       └─ <lang>.js    # nodeca.<namespace>.views.<lang>
│
└─ ...
```

### Stage 4. Compiling static and API tree into merged assets

```
.
└─ assets/
    ├─ <namespace>/
    │   ├─ client.js
    │   ├─ server.js
    │   ├─ shared.js
    │   ├─ bundle.js
    │   ├─ i18n/
    │   │   └─ <lang>.js
    │   ├─ views/
    │   │   └─ <lang>.js
    │   └─ static/
    │       ├─ *.*
    │       ├─ bundle.js
    │       └─ bundle.css
    │
    └─ app_manifest/
        └─ config.<env>.<lang>.<md5sum>.json # App config + assets manifest (See Client Confi)
```
