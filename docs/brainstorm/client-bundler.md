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


### Stage 2. Compile localized views

##### 2.1. Merge and patch JADE views

```
.
├─ <namespace>/
│   └─ views/
│       └─ *.jade
└─ ...
```

##### 2.2. Localize JADE views

We can replace `__('foo.bar')` calls with strings for each language if
translations has no macros, so we are building localized JADEs here...

```
.
├─ <namespace>/
│   └─ views/
│       └─ *.<lang>.jade
└─ ...
```

##### 2.3. Compile JADE views

```
.
├─ <namespace>/
│   └─ views/
│       └─ <lang>.js
└─ ...
```

### Stage 3. Compiling static assets

Patch and merge static files, compile stylus, combine alltogether with data of
stages 1 and 2.

```
.
├─ <namespace>/
│   ├─ api-tree.js
│   ├─ i18n/
│   │   └─ <lang>.js
│   ├─ views/
│   │   └─ <lang>.js
│   └─ *.*
└─ ...
```
