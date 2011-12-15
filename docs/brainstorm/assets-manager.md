## Assets-Manager Workflow

- Each method under `./server/` will become a valid method wrapper under
  `server` api tree on client, keeping almost identical signature but with
  additional last arguement - callback.

  ``` javscript
  // will send a valid JSON request to the server (See Client-Server
  // Communication) for details:
  nodeca.server.forums.posts.create('Hello!', 'Some body', function (err, data) {
    // do somthing once post is created
  });
  ```


#### Generated files structure

```
.
└─ assets/
    ├─ <namespace>/
    │   ├─ client.js        # development: nodeca.<namespace>.client
    │   ├─ server.js        # development: nodeca.<namespace>.server
    │   ├─ shared.js        # development: nodeca.<namespace>.shared
    │   ├─ bundle.js        # production: nodeca.<namespace>.*
    │   ├─ i18n/
    │   │   └─ <lang>.js    # nodeca.<namespace>.i18n.<lang>
    │   ├─ views/
    │   │   └─ <lang>.js    # nodeca.<namespace>.views.<lang>
    │   └─ static/          # assets from public/ static files copied as is
    │       ├─ *.*          # development: CSS, JS; dev + prod: any other files
    │       ├─ bundle.js    # production: compiled/concatenated js files
    │       └─ bundle.css   # production: compiled/concatenated css files
    ├─ config.production.json   # App config + assets manifest (See Client Config)
    └─ config.development.json  # per-environment. need to mix in md5 ?
```

## Client-side config


``` yaml
version: "1.0"                      # Nodeca version
baseurl: "//nodeca.org/assets"      # Base URL for all assets (used by helpers)
assets:                             # per-namespace assets manifest
  <namespace>:
    client.js: <md5sum>
    server.js: <md5sum>
    # ...
```
