Static Bundler
--------------

- prepare dynamic generated files (api-tree, languages)
- grab all views and assets from all enabled applications
- execute skinner to build themes
- localize and compile views (for each theme)
- run assets builder (patch/merge/minify)


### Stage 1. Prepare dynamic data for assets

Once API tree of the application was fully populated, and i18n being loaded,
we generate API tree (with stubbed server methods) and i18n bundles:

```
assets
 └─ system/
     ├─ <namespace>/
     │   ├─ api-tree.js    # nodeca.<namespace>.* (server, shared, client)
     │   └─ i18n/
     │       └─ <lang>.js  # nodeca.<namespace>.i18n.<lang>
     └─ ...
```

`nodeca.<namespace>.server.*` contains methods with signatures similar to
original ones, but bodies ready to be used on the client and call corresponding
server methods transparently.


### Stage 2. Prepare views

##### 2.1. Combine theme views

```
.
├─ views/
│   ├─ theme-<id>/
│   │   ├─ <namespace>
│   │   │   └─ *.jade
│   │   └─ ...
│   └─ ...
└─ ...
```


##### 2.2. Localize JADE views

We can replace `__('foo.bar')` calls with strings for each language if
translations has no macros, so we are building localized JADEs here...

```
.
├─ views/
│   ├─ theme-<id>/
│   │   ├─ <namespace>
│   │   │   └─ *.<lang>.jade
│   │   └─ ...
│   └─ ...
└─ ...
```


##### 2.3. Compile JADE views

Views are compiled into one file (per language).

```
.
├─ views/
│   ├─ theme-<id>/
│   │   ├─ <namespace>
│   │   │   ├─ <lang1>.js
│   │   │   ├─ <lang2>.js
│   │   │   └─ ...
│   │   └─ ...
│   └─ ...
└─ ...
```


### Stage 3. Prepare static assets

Combine, patch, merge and compile static assets (stylus, css, js, etc) of
application and theme for each theme separately.

```
assets/
 └─ static/
     ├─ *                  # Any structure, except <theme-*>
     ├─ theme-<id1>/*.*    # Theme files
     ├─ theme-<id2>/*.*
     └─ ...
```


### Stage 4. Put alltogether

Combine API tree, translations, skinz with views and static data in one place.

```
assets/
 │
 ├─ system/
 │   ├─ <namespace>/
 │   │   ├─ api-tree.js
 │   │   └─ i18n/
 │   │       ├─ <lang1>.js
 │   │       ├─ <lang2>.js
 │   │       └─ ...
 │   └─ ...
 │
 ├─ static/
 │   ├─ *
 │   ├─ theme-<id1>/*.*
 │   ├─ theme-<id2>/*.*
 │   └─ ...
 │
 ├─ views/
 │   ├─theme-<id>/
 │   │   ├─ <namespace>
 │   │   │   ├─ <lang1>.js
 │   │   │   ├─ <lang2>.js
 │   │   │   └─ ...
 │   │   └─ ...
 │   └─ ...
 │
 └─ *.*
```
