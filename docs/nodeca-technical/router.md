# Router

For server and client purposes we use [CrossRoads][router] router.
Routes are described in YAML and bundled into main api tree file as
`nodeca.config.routes` after init. Router instanse is placed at `nodeca.router`.

We use two types of files: `default_routes.yml` for application default routes
and `routes.yml` in main application, that mounts routes and API tree nodes to
domains and/or paths.

## Application Default Routes

Application default routes file defines routes and list of direct invocators
only.

``` yaml
--- # file: ./config/default_routes.yml
routes:
  "/f{forum_id}/":
    to: forums.list
    params:
      forum_id: /\d+/
  "/f{forum_id}/index{page}.html":
    to: forums.list
    params:
      forum_id: /\d+/
      page: /[2-9]|[1-9]\d+/
  "/f{forum_id}/thread{thread_id}.html":
    to: forums.threads.show
    params:
      forum_id: /\d+/
      thread_id: /\d+/
  "/f{forum_id}/thread{thread_id}-{page}.html":
    to: forums.threads.show
    params:
      forum_id: /\d+/
      thread_id: /\d+/
      page: /[2-9]|[1-9]\d+/
  "/f{forum_id}/thread{thread_id}-{goto}.html":
    to: forums.threads.redirect
    params:
      forum_id: /\d+/
      thread_id: /\d+/
      goto: [ 'new-post', 'last-post' ]
  "/search/":
    to: search
  "#/users/profile/{user_id}/{tab}":
    to: users.profile
    params:
      user_id: /\d+/
      tab: [ 'general', 'last-msgs' ]
```

**NOTICE** Routes with leading `#` are used by clients ONLY.


### Options

-   **to**: Mandatory. Server method to be called.
-   **params**: Optional. Parameters rules hash of key => rules.
    Each rule might be either `String` or `Object` that consist of fields:
    -   *match* Optional. Rule to match value of param, `Array` or `RegExp`.
    -   *required* Optional. Default: true.
    -   *default* Optional. Default value of param.
    Specifing rule as string (or regexp string) is a shorthand syntax for
    -   `{ match: <rule> }` if regexp ro array:
        -   `foo: /bar/` -> `foo: { match: /bar/, required: true }`
        -   `foo: [1,2]` -> `foo: { match: [1,2], required: true }`
    -   `{ value: <rule> }` otherwise
        -   `foo: bar` -> `foo: { default: bar, required: false }`
        -   `foo: 123` -> `foo: { default: 123, required: false }`

**NOTICE** that *required* flag is ignored, if param have *default* value.


## Direct Invocators

Sometimes we want API methods to be accessible via direct HTTP links and browser
history. For this purpose we use *direct invocator* rule which looks like:

`/!{methodname}?param1=val1&...&paramN=valN`

Technically, such link will run page loader first, then update page inline. 

``` yaml
--- # file: ./config/default_routes.yml
direct:
  - forums.threads.show
  - search
```

**CAUTION**. NEVER give direct access to methods, that posts data. That will
cause CSRF vulnerability. **ONCE AGAIN**. Only give direct access to "read"
methods, with will not modify data. Posting should be done ONLY via realtime
call, when user click on links, buttons, and so on. 

**NOTICE** Before dispatching "direct" invocator, we try to find appropriate
"SEO" route for it, and if exists - redirect there with 301 code.
Here is algorithm, how to find "appropriate" URL:

-   find all possible routes for given method
-   filter out routes with same amount (and names) of params
-   use first route which param rules fit given values

For example, using routes map from above:

-   */!forums.list?forum_id=123*
    `-> /f{forum_id}`: no page_id requried for "paged" verion
-   */!forums.list?forum_id=123&page_id=3*
    `-> /f{forum_id}/index{page}.html`: page_id matches `/[2-9]|[1-9]\d+/`
-   */!forums.list?forum_id=123&page_id=1*
    (!) no redirect, as no page_id does not match RegExp of second route and
    first route has no such param at all

Notice third decision. Unfortunately we are not able to guess automatically this
situation, so instead we can become more verbose, and rewrite our first route
rule as:

``` yaml
routes:
  "/f{forum_id}/":
    to: forums.list
    params:
      page: /[01]/
      forum_id: /\d+/
  # ...
```

In this case, request to */!forums.list?forum_id=123&page_id=1* will be
redirected to "/f{forum_id}/".


## Main Application Routes

In the main application's routes files we can specify (alnog with direct
invocators and routes) redirect rules and mounting rules.

When we add route pointing the API tree method that already have route within
application default routes, all default routes for that method will be removed.
In case if the method had more than one route, you might need to specify all
other routes as well.

## Redirects

For simple redirects, which do not involve any calcualtions we use `redirect`
map in the `routes` file. The syntax is dead-simple:

``` yaml
---
redirect:
  "/f{forum_id}/thread{thread_id}.html":
    to: [ 301, "/t-{forum_id}-{thread_id}.aspx" ]
    params:
      forum_id: /\d+/
      thread_id: /\d+/
```

For complex situations we recommend to use server API tree and normal routes
instead, e.g.:

``` yaml
---
routes:
  "/f{forum_id}/thread{thread_id}.html":
    to: server.forums.redirect
```

However, you are free to specify your function right in YAML file:

``` yaml
---
redirect:
  "/f{forum_id}/thread{thread_id}.html":
    to: !!js/function >
      function redirect(forum_id, thread_id, cb) {
        // this is nodeca
        var slugize = this.helpers.slugize;
        this.models.forum.find(forum_id, function (err, forum) {
          if (err) {
            cb(err);
            return;
          }

          cb(null, 301, '/forums/' + forum_id + '-' + sluggize(forum.title));
        });
      }
    params:
      forum_id: /\d+/
      thread_id: /\d+/
```


## Mounting Applications

You can "mount" API tree nodes (or some of your routes) under different
domain name and/or paths.

``` yaml
---
mount:
  # SYNOPSIS:
  #
  # <mount point>:
  #   from: <server api tree node>
  #   routes: <same as default routes>
  #
  # mount point: //<domain> || /<path> || //<domain>/<path>

 
  # Mount all nodeca.server.forum.* methods under domain `forums.nodeca.org`
  //forums.nodeca.org:
    from: forum

  # Mount all ndoeca.server.blog.* methods under path `/blogs`
  # and provide some additional routes
  /blogs:
    from: blog
    routes:
      /latest:
        to: blog.posts.list
        params:
          limit: {default: 5}
          sort_by: {default: date}
          order: {default: desc}
```


## Helpers

These helpers are available on both client and server.

``` javascript
// tries to find apropriate URL y server method and arguments
link_to(forums.list, {forum_id: 123, page: 3});
```


[router]: https://github.com/millermedeiros/crossroads.js
