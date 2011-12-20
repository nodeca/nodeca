Router
------

For server and client purposes we use [director][] router.
Routes are described in YAML and then later on bounded to `nodeca.router`, where
director lives.

Example:

``` yaml
---
routes:
  "/:forum_id/:thread_id.html": nodeca.server.forums.threads.show
  # if we have messed params order we can remap it like this:
  "/:thread_id/:forum_id":
    to: nodeca.server.forums.forums.list
    remap: [ 1, 0 ]

params:
  forum_id: !!js/regexp /f(\d+)/
  thread_id: !!js/regexp /thread(\d+)/
```

Upon application start we read YAML description of routes and configure server
router with given definition. Parsed router configuration is sent to client as
part of the client config under `router` section:

```
nodeca.config.router = {
  routes: {
    "/:forum_id/:thread_id.html": "nodeca.server.forums.threads.show",
    // ...
  },
  params: {
    // ...
  }
};
```

[director]: https://github.com/flatiron/director
