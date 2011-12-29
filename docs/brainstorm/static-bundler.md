Static Bundler
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


### Stage 2. Prepare views

##### 2.1. Combine "generic" views

```
.
├─ <namespace>/
│   └─ views/
│       └─ *.jade
└─ ...
```


##### 2.2. Prepare skins

```
.
├─ <namespace>/
│   └─ skinz/
│       └─ <skin_name>/
│           └─ views/
│               └─ *.jade
└─ ...
```


##### 2.3. Localize JADE views

We can replace `__('foo.bar')` calls with strings for each language if
translations has no macros, so we are building localized JADEs here...

```
.
├─ <namespace>/
│   └─ skinz/
│       └─ <skin_name>/
│           └─ views/
│               └─ *.<lang>.jade
└─ ...
```


##### 2.4. Compile JADE views

Compiled views will become part of the api-tree. For example if we have
`posts/create.jade` within `forums` namespace, then it will become accessible
as `nodeca.views.forums.posts.create()`. Views are compiled into one file (per
language) that contains full views subtree.

```
.
├─ <namespace>/
│   └─ skinz/
│       └─ <skin_name>/
│           └─ views/
│               └─ <lang>.js
└─ ...
```


### Stage 3. Compile static assets

Patch and merge static files, compile stylus for each skin using generic static
files as base structure.

```
.
├─ <namespace>/
│   └─ skinz/
│       └─ <skin_name>/
│           └─ *.*
└─ ...
```


### Stage 4. Put alltogether

Combine API tree, trnslations, skinz with views and static data in one place.

```
.
├─ <namespace>/
│   ├─ api-tree.js
│   ├─ i18n/
│   │   └─ <lang>.js
│   └─ skinz/
│       └─ <skin_name>/
│           ├─ views/
│           │   └─ <lang>.js
│           └─ *.*
└─ ...
```
