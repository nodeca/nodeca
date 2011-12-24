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
    forum_id: /\d+/
"/f{forum_id}/index{page}.html":
  to: nodeca.server.forums.list
  rules:
    forum_id: /\d+/
    page: /\d+/
"/f{forum_id}/thread{thread_id}.html":
  to: nodeca.server.forums.threads.show
  rules:
    forum_id: /\d+/
    thread_id: /\d+/
"/f{forum_id}/thread{thread_id}-{page}.html":
  to: nodeca.server.forums.threads.show
  rules:
    forum_id: /\d+/
    thread_id: /\d+/
    page: /\d+/
"/f{forum_id}/thread{thread_id}-{goto}.html":
  to: nodeca.server.forums.threads.redirect
  rules:
    forum_id: /\d+/
    thread_id: /\d+/
    goto: [ 'new-post', 'last-post' ]
# ...

# search example:
# - /search/blogs/place+like+home
# - /#/search/blogs/place+like+home
"/search/{group}/{query}":
  to: nodeca.server.search
  rules:
    group: [ 'forums', 'blogs', 'groups' ]
    query: /.+/

# profile example:
# - /#/user/profile/84/general
"/user/profile/{user_id}/{tab}":
  to: nodeca.server.users.profile
  rules:
    user_id: /\d+/
    tab: [ 'general', 'last-msgs' ]
  hashOnly: true
```

#### Options

-   **to**: Mandatory. Server method to be called.
-   **rules**: Optional. Rules of substitutions. It must be a hash of key =>
    value pairs (see example above), where value is either a RegExp or array of
    possible values. Matched values will be passed as params (with corresponding
    names) for server method.
-   **params**: Optional. Static values for params. This params will be passed
    along with mathced values from *rules*. Think of them as of default values.
-   **hashOnly**: Optional. Boolean true if you want this URL to be available as
    "hash" based only (to avoid search spiders reach it). By default: `false`.

#### Default Route

We have one default route which is used when router can't find appropriate
record. This route used mainly to build URLs on the client and when we receive
HTTP request. It looks like:

`/{methodname}?param1=val1&...&paramN=valN`

For example:

`/forums.threads.redirect?forum_id=91&thread_id=1051&goto=last-post`

#### Helpers

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
