API Tree
========

Most resources are mapped to API Tree structure `nodeca`. It can be different
on server and slient, but some methods are specially converted for translared
calls.

Full structure:

```
nodeca

  # main core :) . server & client

  client                  # client methods
  server                  # server methods (on client - async mappers)
  shared                  # available on both client & server,
                          # mostly for helpers

  # server only

  permissions             # access rules
  filters                 # hooks for server methods (mostly to attach access rules)
  settings                # settings accessor (get/set, not tree)
  config                  # parsed config file.
  logger                  # logger instance (winston on server)

  # server & client, dynamic data

  runtime                 # `dynamic` structures
    version               # "1.0.0"
    assets_root           # Root URL for assets `//nodeca.com/assets/`
    bundle                # info about namespaces from static builder
    router                # router instance, filled with routes from config

    debug                 # client flag, to show more info
    language              # client language
```


bundle
------

Collection of CRCs for loadable resources.  It helps to properly cache
static data in local store, and refresh those on server upgrade.

``` javascript
{
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
```

