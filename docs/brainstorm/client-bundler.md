Client Bundler
--------------

### Stage 1. Prepare dynamic data for assets

Once API tree of the application was fully populated, and i18n being loaded,
we generate API tree (with stubbed server methods) and i18n bundles:

```
.
├─ <namespace>/
│   ├─ api-tree.js      # nodeca.<namespace>.* (server, shared, client)
│   └─ i18n/
│       └─ <lang>.js    # nodeca.<namespace>.i18n.<lang>
└─ ...
```

`nodeca.<namespace>.server.*` contains methods with signatures similar to
original ones, but bodies ready to be used on the client and call corresponding
server methods transparently.


### Stage 2. Compiling static assets and merging it with dynamic data assets

```
.
├─ <namespace>/
│   ├─ api-tree.js
│   ├─ i18n/
│   │   └─ <lang>.js
│   ├─ views/
│   │   └─ *.jade       # Raw JADE files (we need them for the third stage)
│   └─ *.*              # All other files from /static/ from applications
└─ ...
```


### Stage 3. Building compiled localized views

```
.
├─ <namespace>/
│   ├─ api-tree.js
│   ├─ i18n/
│   │   └─ <lang>.js
│   ├─ views/
│   │   └─ <lang>.js    # All *.jade files are compiled and merged together per-language
│   └─ *.*
└─ ...
```
