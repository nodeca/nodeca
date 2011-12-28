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

**NOTICE** Routes with leading `#` are used by clients ONLY.


### Options

-   **to**: Mandatory. Server method to be called.
-   **params**: Optional. Parameters rules hash of key => rules.
    Each rule might be either `String` or `Object` that consist of fields:
    -   *match* Mandatory. Rule to match value of param, `Array` or `RegExp`
    -   *required* Optional. Default: false.
    -   *default* Optional. Default value of param.
    Specifing rule as string is a shorthand syntax for `{ match: <rule> }`


## Direct Invocators with Default Route

Sometimes we want API methods to be mapped strightly to HTTP request. For this
purpose we use *default route* rule which looks like:

`/!{methodname}?param1=val1&...&paramN=valN`

For security purposes methods are invoced by "default route" only if they are
listed in the `direct` whitelist.

``` yaml
--- # file: ./config/routes.yml
direct:
  - forums.threads.show
  - search
```

**NOTICE** Before dispatching "direct" invocator, we try to find appropriate
route for it, and if found - redirect there with 301 code. Algorithm of
searching "appropriate" URL is as follows:

-   find all possible routes for given method
-   filter out routes with same amount (and names) of params
-   use first route which param rules given values

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


## Helpers

These helpers are available on both client and server.

``` javascript
// tries to find apropriate URL y server method and arguments
link_to(forums.list, {forum_id: 123, page: 3});
```


[router]: https://github.com/millermedeiros/crossroads.js
