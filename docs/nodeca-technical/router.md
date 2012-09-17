# Router

For server and client purposes we use [Pointer][Pointer] router.
Routes are described in YAML and bundled into main api tree file as
`nodeca.config.routes` after init. Router instanse is accessible as
`nodeca.runtime.router`.

## Application Routes

Application routes are defined in `router.map` section of configs:

``` yaml
---
router:
  map:
    forums.list:
      "/f{forum_id}/":
        forum_id: /\d+/
      "/f{forum_id}/index({page}).html":
        forum_id: /\d+/
        page:
          match: /[2-9]|[1-9]\d+/
          default: 1

    forums.threads.show:
      "/f{forum_id}/thread{thread_id}(-{page}).html":
        forum_id: /\d+/
        thread_id: /\d+/
        page:
          match: /[2-9]|[1-9]\d+/
          default: 1

    forums.threads.redirect:
      "/f{forum_id}/thread{thread_id}-{goto}.html":
        forum_id: /\d+/
        thread_id: /\d+/
        goto: /new-post|last-post/

    search:
      "/search/": ~

    users.profile:
      "#/users/profile/{user_id}/{tab}":
        user_id: /\d+/
        tab: /general|last-msgs/
```

**NOTICE** Routes with leading `#` are used by clients ONLY.


### Route Params Options

OPTIONAL.

Parameters rules hash of key => rules.
Each rule might be either `String` or `Object` that consist of fields:

    -   *match* Optional. Rule to match value of param, `Array` or `RegExp`.
    -   *default* Optional. Default value of param.

See [Pointer][Pointer-Route] `new Route` documentation of `params` options.


### Slugs (optional)

Routes can contain slugs.Technically, that's usual optional params.

``` yaml
router:
  map:
    faq.post.show:
      "/qa/({categoryslug}/){post_id}(-{postslug}).html": ~
```

The route above will match any of the following URLs:

```
/qa/123.html
/qa/123-pochemu-krokodil-zelyoni.html
/qa/animals/123-pochemu-krokodil-zelyoni.html
```

Recommended behavior for app developers is to redirect all non-full url's
with 302 code. This can be done with `before` filter. Note, that it's a good
idea to cache full url (or md5) - to avoid recalculations on every request.


## (!!!) Direct Invocators

Sometimes we want API methods to be accessible via direct HTTP links and browser
history. For this purpose we use *direct invocator* rule which looks like:

`/!{methodname}?param1=val1&...&paramN=valN`

Technically, such link will run page loader first, then update page inline.

``` yaml
--- # file: ./config/default_routes.yml
direct_invocators:
  forums.threads.show: on
  search: on
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
  forums.list:
    "/f{forum_id}/":
      page: /[01]/
      forum_id: /\d+/
  # ...
```

In this case, request to */!forums.list?forum_id=123&page_id=1* will be
redirected to "/f{forum_id}/".


## (!!!) Redirects

For simple redirects, which do not involve any calcualtions we use `redirect`
map in the `routes` file. The syntax is dead-simple:

``` yaml
---
redirects:
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
  server.forums.redirect:
    "/f{forum_id}/thread{thread_id}.html": ~
```

However, you are free to specify your function right in YAML file:

``` yaml
redirects:
  "/f{forum_id}.html":
    to: !!js/function >
      function redirect(forum_id, cb) {
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
```

## (???) Mounting Applications

You can "mount" API tree nodes under different domain name and/or paths.

**NOTICE** You can mount only "first-level" nodes, e.g. `forum`, `blog`, etc.

``` yaml
---
mount:
  # SYNOPSIS:
  #
  # <server api tree node>: <mount point>
  #
  # mount point: //<domain> || /<path> || //<domain>/<path>


  # Mount all nodeca.server.forum.* methods under domain `forums.nodeca.org`
  forum: //forums.nodeca.org

  # Mount all ndoeca.server.blog.* methods under path `/blogs`
  blog: /blogs
```


## View Helpers

These helpers are available on both client and server.

``` javascript
// tries to find apropriate URL y server method and arguments
linkTo('forums.list', {forum_id: 123, page: 3});
```


[Pointer]:        https://github.com/nodeca/pointer
[Pointer-Route]:  http://nodeca.github.com/pointer/#Route.new
