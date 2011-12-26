# Router

For server and client purposes we use [CrossRoads][router] router.
Routes are described in YAML and then later on bounded to `nodeca.router`.
Map of routes should be placed unders `./config/routes.yml`

Example:

``` yaml
---
"/f{forum_id}/":
  to: forums.list
  params:
    forum_id: /\d+/
"/f{forum_id}/index{page}.html":
  to: forums.list
  params:
    page:
      default: 0
      required: false
    forum_id: /\d+/
    page: /[1-9]\d+|[2-9]/
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
    page: /\d+/
"/f{forum_id}/thread{thread_id}-{goto}.html":
  to: forums.threads.redirect
  params:
    forum_id: /\d+/
    thread_id: /\d+/
    goto: [ 'new-post', 'last-post' ]
"/search/":
  to: search
  dangerous: true # allow params not listed here
  params:
    group:
      default: 'forums'
      match: [ 'forums', 'blogs', 'groups' ]
    query:
      required: false
      match: /.+/
"/users/profile/{user_id}/{tab}":
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
    -   *required* Optional. Default: false
    -   *default* Optional. Default value of param.
    Specifing rule as string is a shorthand syntax for
    `{ match: <rule>, required: true }`
-   **dangerous**: Optional. Default: false. Allows accepting params not listed
    in the params rules.
-   **name**: Optional. Used to give route unique name to simplify usage within
    view helpers.


#### Direct Invocators (ex Defuault Rule)

Sometimes we want API methods to be mapped strightly to HTTP request. For this
purpose we use *default route* rule which looks like:

`/#/{methodname}?param1=val1&...&paramN=valN`

For security purposes ALL methods are not allowed to be called with default rule
uness theya re listed in the list of invocators (file `./config/invocators.yml`)
which is similar to routes definition file with some diference.

Each key is a API method, e.g. `forums.posts.list`. Options are same as routes
but only `params` and `dangerous` are allowed.

Example:

``` yaml
---
forums.threads.show:
  params:
    forum_id: /\d+/
    thread_id: /\d+/

search:
  dangerous: true
  params:
    group:
      default: 'forums'
      match: [ 'forums', 'blogs', 'groups' ]
    query:
      required: false
      match: /.+/
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
