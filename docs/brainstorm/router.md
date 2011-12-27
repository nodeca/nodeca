# Router

For server and client purposes we use [CrossRoads][router] router.
Routes are described in YAML and then later on bounded to `nodeca.router`.

Example:

``` yaml
--- # file: ./config/routes.yml
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


#### Options

-   **to**: Mandatory. Server method to be called.
-   **params**: Optional. Parameters rules hash of key => rules.
    Each rule might be either `String` or `Object` that consist of fields:
    -   *match* Mandatory. Rule to match value of param, `Array` or `RegExp`
    -   *required* Optional. Default: false.
    -   *default* Optional. Default value of param.
    Specifing rule as string is a shorthand syntax for `{ match: <rule> }`
-   **name**: Optional. Used to give route unique name to simplify usage within
    view helpers.


#### Direct Invocators with Default Route

Sometimes we want API methods to be mapped strightly to HTTP request. For this
purpose we use *default route* rule which looks like:

`/!{methodname}?param1=val1&...&paramN=valN`

For security purposes methods are invoced by "default route" only if they are
listed in the `direct` whitelist.

``` yaml
--- # file: ./config/routes.yml
direct:
  forums.threads.show: on
  search: on
```


#### Redirects

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
            next(err);
            return;
          }

          cb(null, 301, '/forums/' + forum_id + '-' + sluggize(forum.title));
        });
      }
    params:
      forum_id: /\d+/
      thread_id: /\d+/
```


#### Helpers

TBD

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
