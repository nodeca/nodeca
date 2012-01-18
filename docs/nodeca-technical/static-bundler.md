Static Bundler
--------------

### Stage 1. Preapare temporary files

##### 1.1. prepare dynamic generated files (api-tree, languages).

```
tmp/
  └─ output/
      └─ system/
          ├─ <namespace>/
          │   ├─ api-tree.js    # nodeca.<namespace>.* (server, shared, client)
          │   └─ i18n/
          │       └─ <lang>.js  # nodeca.<namespace>.i18n.<lang>
          └─ ...
```


##### 1.2. make copy of all views and assets tmp directories by app.

make copy of all views and assets from all enabled applications into
tmp directories by app. make unque filenames for patch files.

```
tmp/
  ├─ output/
  │   └─ system/
  │       ├─ <namespace>/
  │       │   ├─ api-tree.js      # nodeca.<namespace>.* (server, shared, client)
  │       │   └─ i18n/
  │       │       └─ <lang>.json  # nodeca.<namespace>.i18n.<lang>
  │       └─ ...
  └─ sources/
      ├─ <app>/
      │   ├─ assets/
      │   │   ├─ *.*
      │   │   ├─ theme-<id>/*.*
      │   │   └─ ...
      │   └─ views/
      │       ├─ theme-<id>/*.*
      │       └─ ...
      └─ ...
```


##### 1.3. make unique filenames for patches

This is required to avoid name collisions on following step(s).
Snapshot same as above.

    *.(patch|before|after)          -> *.10.{md5}.(patch|before|after)
    *.{prio}.(patch|before|after)   -> *.{prio}.{md5}.(patch|before|after)


##### 1.4. move base themes (not inherited or extended) into one place.

```
tmp/
  ├─ output/
  │   ├─ system/
  │   │   ├─ <namespace>/
  │   │   │   ├─ api-tree.js      # nodeca.<namespace>.* (server, shared, client)
  │   │   │   └─ i18n/
  │   │   │       └─ <lang>.json  # nodeca.<namespace>.i18n.<lang>
  │   │   └─ ...
  │   ├─ assets/
  │   │   ├─ theme-<id>/*.*
  │   │   └─ ...
  │   └─ views/
  │       ├─ theme-<id>/*.*
  │       └─ ...
  └─ sources/
      ├─ <app>/
      │   ├─ assets/
      │   │   ├─ *.*
      │   │   ├─ theme-<id>/*.*
      │   │   └─ ...
      │   └─ views/
      │       ├─ theme-<id>/*.*
      │       └─ ...
      └─ ...
```


### Stage 2. Merge modules assets & apply skin rules (inheritance/extentions)

- *2.1.* merge extended themes files into base themes.
- *2.2.* prepare directories of inherited themes. watch for inheritance tree.
- *2.3.* merge non-theme assets. 

```
tmp/
  └─ output/
      ├─ system/
      │   ├─ <namespace>/
      │   │   ├─ api-tree.js      # nodeca.<namespace>.* (server, shared, client)
      │   │   └─ i18n/
      │   │       └─ <lang>.json  # nodeca.<namespace>.i18n.<lang>
      │   └─ ...
      ├─ assets/
      │   ├─ *.*
      │   ├─ theme-<id>/*.*
      │   └─ ...
      └─ views/
          ├─ theme-<id>/*.*
          └─ ...
```


### Stage 3. Apply patches & bundle `_*` dirs

- *3.1.* apply patches for assets and views.
- *3.2.* merge (bundle) subdirs into files (`./assets/_foobar.js/*` -> `./assets/foobar.js`). If destination file exists,
  bundle will be added BEFORE it. If destination file absents, it will be created.

```
tmp/
  └─ output/
      ├─ system/
      │   ├─ <namespace>/
      │   │   ├─ api-tree.js      # nodeca.<namespace>.* (server, shared, client)
      │   │   └─ i18n/
      │   │       └─ <lang>.json  # nodeca.<namespace>.i18n.<lang>
      │   └─ ...
      ├─ assets/
      │   ├─ *.*
      │   ├─ theme-<id>/*.*
      │   └─ ...
      └─ views/
          ├─ theme-<id>/*.*
          │   ├─ <namespace>
          │   │   └─ *.jade
          │   └─ ...
          └─ ...
```


### Stage 4. localize views (for each theme).

```
tmp/
  └─ output/
      ├─ system/
      │   ├─ <namespace>/
      │   │   ├─ api-tree.js      # nodeca.<namespace>.* (server, shared, client)
      │   │   └─ i18n/
      │   │       └─ <lang>.json  # nodeca.<namespace>.i18n.<lang>
      │   └─ ...
      ├─ assets/
      │   ├─ *.*
      │   ├─ theme-<id>/*.*
      │   └─ ...
      └─ views/
          ├─ theme-<id>/*.*
          │   ├─ <namespace>
          │   │   └─ *.<lang>.jade
          │   └─ ...
          └─ ...
```


### Stage 5. Compile, minify

##### 5.1. Compile and combine JADE files

```
tmp/
  └─ output/
      ├─ system/
      │   ├─ <namespace>/
      │   │   ├─ api-tree.js      # nodeca.<namespace>.* (server, shared, client)
      │   │   └─ i18n/
      │   │       └─ <lang>.json  # nodeca.<namespace>.i18n.<lang>
      │   └─ ...
      ├─ assets/
      │   ├─ *.*
      │   ├─ theme-<id>/*.*
      │   └─ ...
      └─ views/
          ├─ theme-<id>/*.*
          │   ├─ <namespace>
          │   │   ├─ <lang>.json
          │   │   └─ ...
          │   └─ ...
          └─ ...
```

##### 5.2. Compile Stylus files

```
tmp/
  └─ output/
      ├─ system/
      │   ├─ <namespace>/
      │   │   ├─ api-tree.js      # nodeca.<namespace>.* (server, shared, client)
      │   │   └─ i18n/
      │   │       └─ <lang>.json  # nodeca.<namespace>.i18n.<lang>
      │   └─ ...
      ├─ assets/
      │   ├─ *.*
      │   ├─ theme-<id>/
      │   │   ├─ *.css
      │   │   └─ *.*
      │   └─ ...
      └─ views/
          ├─ theme-<id>/*.*
          │   ├─ <namespace>
          │   │   ├─ <lang>.json
          │   │   └─ ...
          │   └─ ...
          └─ ...
```

##### 5.3. Uglify assets.

See above.
