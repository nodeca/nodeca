Router
------

For server and client purposes we use [CrossRoads][router] router.
Routes are described in YAML and then later on bounded to `nodeca.router`.

Example:

``` yaml
---
"/f{forum_id}":
  to: nodeca.server.forums.list
  rules:
    forum_id: !!js/regexp /\d+/
"/f{forum_id}/index{page}.html":
  to: nodeca.server.forums.list
  rules:
    forum_id: !!js/regexp /\d+/
    page: !!js/regexp /\d+/
"/f{forum_id}/thread{thread_id}.html":
  to: nodeca.server.forums.threads.show
  rules:
    forum_id: !!js/regexp /\d+/
    thread_id: !!js/regexp /\d+/
"/f{forum_id}/thread{thread_id}-{page}.html":
  to: nodeca.server.forums.threads.show
  rules:
    forum_id: !!js/regexp /\d+/
    thread_id: !!js/regexp /\d+/
    page: !!js/regexp /\d+/
"/f{forum_id}/thread{thread_id}-last-post.html":
  to: nodeca.server.forums.threads.redirect
  params: { goto: last-post }
  rules:
    forum_id: !!js/regexp /\d+/
    thread_id: !!js/regexp /\d+/
"/f{forum_id}/thread{thread_id}-new-post.html":
  to: nodeca.server.forums.threads.redirect
  name: threads/new-post
  params: { goto: new-post }
  rules:
    forum_id: !!js/regexp /\d+/
    thread_id: !!js/regexp /\d+/
# ...
```

Upon application start we read YAML description of routes and configure server
router with given definition. Parsed router configuration is sent to client as
part of the client config under `router` section.

Router config is used for:

- find apropriate server method when parsing URL on client
- make SEO link for server method.

Helper that builds SEO links have signature of:

``` javascript
// tries to find apropriate URL y server method and arguments
link_to(nodeca.server.forums.threads.redirect,
        {forum_id: 123, thread_id: 123, goto: "new-post"});

// or use "named" route
link_to("forums.threads/new-post", {forum_id: 123, thread_id: 123});
```

[router]: https://github.com/millermedeiros/crossroads.js
