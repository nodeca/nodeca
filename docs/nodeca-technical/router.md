# Router

For server and client purposes we use [Pointer][Pointer] router.
Routes are described in YAML and bundled into main api tree file as
`nodeca.config.router` after init. Router instanse is accessible as
`nodeca.runtime.router`.

Router config for the client is kept under `nodeca.runtime.client_routes`.

## Application Routes

Application routes are defined in `router.map` section of config files:

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

**NOTICE**
Routes with leading `#` are used by clients ONLY.
*Not implemented yet*


### Route Params Options

OPTIONAL.

Parameters rules hash of key => rules.
Each rule might be either `String` or `Object` that consist of fields:

    - **match** (Optional) Rule to match value of param, `Array` or `RegExp`.
    - **default** (Optional) Default value of param.

See [Pointer][Pointer-Route] `new Route` documentation of `params` options.


### Slugs

Routes can contain slugs. Technically, that's usual optional params.

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


## Direct Invocators

Sometimes we want API methods to be accessible via direct HTTP links and browser
history. For this purpose we use *direct invocator* rule which looks like:

`/!{methodname}?param1=val1&...&paramN=valN`

Technically, such link will run page loader first, then update page inline.

``` yaml
---
router:
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
router:
  map:
    forums.list:
      "/f{forum_id}/":
        page: /[01]/
        forum_id: /\d+/
    # ...
```

In this case, request to */!forums.list?forum_id=123&page_id=1* will be
redirected to "/f{forum_id}/".


## Mounting (and binding) applications

Mounting (and binding) of applications is described in `bind` section of config
files. It has _API path_ as key and options of it's binding as values, e.g.:

``` yaml
bind:
  default:
    listen: 0.0.0.0:3000

  forums:
    mount: /forum
```


Options are Objects of key-value pairs. All parts are optional:

- **listen** (String): Which `address[:port = 80]` we should listen. It is
  useful when you want to bind different parts of application on different
  interfaces, e.g. use SSL for users only, or separate interface for assets.
- **mount** (String): Mount point given in form of `[proto://host:port][/path]`,
  `proto` and `port` are optional. Examples:
  - `https://users.nodeca.org`:
    mount to the root of `users.ndoca.org` host using HTTPS protocol only.
  - `//beta.nodeca.org:3000`:
    mount to the root of `beta.ndoca.org:3000` host using any protocol.
  - `/forum`:
    mount to the `/forum` path of any host using any protocol.
  - `//dev.nodeca.org:3000/users`:
    mount to the `/users` path of `dev.nodeca.org:3000` host using any protocol.
- **ssl** (Object): Contains paths to `pfx` or `key` and `cert` files. Paths are
  relative to the main app root, but you may specify _absolute_ pathname that
  starts with a leading slash.


### HTTPS

As you can see above you can make nodeca start SSL server. Here's an example
configuration that starts an https server on 443 port:

``` yaml
bind:
  default:
    listen: 0.0.0.0:443
    mount:  https://dev.nodeca.org
    ssl:
      key:  ./etc/server.key
      cert: ./etc/server.cert
```

You may also want to use stunnel for HTTPS while running nodeca application in
normal mode, for this purposes you MUST not specify `ssl` option, and provide
only a protocol-specific mount point:

``` yaml
bind:
  default:
    listen: 127.0.0.1:3000
    mount:  https://dev.nodeca.org
```


#### Generating self-signed SSLcertificate

``` bash
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr

cp server.key server.key.orig
openssl rsa -in server.key.orig -out server.key

openssl x509 -req -days 365 -in server.csr \
        -signkey server.key -out server.cert
```


### Fallbacks

You can mount/bind any part of `nodeca.server` tree, even serve `forum.posts`
and `forum.threads` by different address:port points (although if you do so,
I recommend you to visit a doctor).

When you specify mount/bind options for `forum` and `forum.posts`, the last one
will use options of `forum` as "defaults". In this case we can describe the way
of fallbacks as follows:

   bind['default'] + bind['forum'] + bind['forum.posts']


#### Default mount/binding point

You can use `default` bind-level key to describe "default" fallback mount point.
Options of this case are used as "defaults" for all API paths and take place,
when API path has no mount/bind options:

``` yaml
default:
  listen: 0.0.0.0:80

forum:
  mount: /forum

#
# equals to:
#

default:
  listen: 0.0.0.0:80

forum:
  listen: 0.0.0.0:80
  mount: /forum
```


### Handling invalid hosts

There is a _special case_ bind-level key `_` for the _invalid hosts_ handler:

``` yaml
bind:
  _: !!js/function |
    function (req, res) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Invalid host ' + req.headers.host);
    }
```


## View Helpers

These helpers are available on both client and server.

``` javascript
// tries to find apropriate URL y server method and arguments
linkTo('forums.list', {forum_id: 123, page: 3});
```


[Pointer]:        https://github.com/nodeca/pointer
[Pointer-Route]:  http://nodeca.github.com/pointer/#Route.new
