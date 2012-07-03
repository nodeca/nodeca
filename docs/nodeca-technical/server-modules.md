# Server Modules

All modules/methods from `server` folder will be mapped to API Tree under
`nodeca.server` scope. Those items will be also publically to clients
(via streams). Example:

```
├─ server/
│   └─ admin/
│       ├─ dashboard.js
│       └─ users.js
└─ internal/
    └─ ...
```

Note, we reserve `internal` folder for server-server IPC. For example, when you
like to run isolated process to log money transaction and so on.

Every module can have 1 or multiple methods. All `exports` are mapped to
API Tree. See examples below.

``` javascript
// file: admin/users.js

module.exports.list = function list(params, cb) {
  // ...
};

module.exports.show = function show(params, cb) {
  // ...
};
```

or provide exactly one method:

``` javascript
// file: admin/dashboard.js
module.exports = function (params, cb) {
  // ...
};
```

## Module Initialization

For modules initialization we use `__init__` method, which is called (if exists)
after module was required. This method is called with the only argument:

- `nodeca`: Reference to root node of the API tree

``` javascript
module.exports.list = function list(params, cb) { /* ... */ };

// ...

module.exports.__init__ = function () {
  nodeca.filters.after('list', function (params, next) {
    // See filters for details...
  });
};
```

Module initialization is needed to guarntee that your filters and permissions
will be attached after nodes were attached to the server tree.


## Method Invocation

Every method should have callback as last argument. Other args can be of any
type.

Methods are executed in context of request enviroment (See Request Environment).
So, you can access session info and other request data. You can attach `before`
and `after` filters for your methods, which are called prior and after method:

*NOTICE* that filters will receive the same arguments as server method.

``` javascript
module.exports.list = function list(params, next) {
  console.log('method: ' + this.test);
  next();
};


module.exports.__init__ = function () {
  nodeca.filters.before('list', function (params, next) {
    this.test = 1;
    console.log('filter 1: ' + this.test);
    next();
  });

  nodeca.filters.before('list', function (params, next) {
    this.test += 2;
    console.log('filter 2: ' + this.test);
    next();
  });

  nodeca.filters.after('list', function (params, next) {
    this.test += 3;
    console.log('filter 3: ' + this.test);
    next();
  });
};
```

Calling `list` method of above will produce following in the console:

```
filter 1: 1
filter 2: 3
method: 3
filter 3: 6
```


## Request Environment

All requests are executed within separate context, with `env` structure
available:

```
env                     # `this` context of actions/filters
  extras                # shared storage for data (used for helpers)

  helpers               # helpers added by filters and available in views
    t                   # babelfish.t proxy, without `language` param

  origin
    http                # When request comes from HTTP, this will contain real
      req               # server request and server response objects.
      res               #
    realtime            # Boolean `true` flag when request comes from realtime.

  skip                  # Array of strings used by "skippable" filters to decide
                        # whenever they need to be skipped or not.

  session               # session data
    session_id
    user_id
    locale
    theme

  request               # request details
    origin (RT|HTTP)    # invocation method (readltime [websocket] / http)
    method              # called method name (e.g.: ‘forum.posts.show’)
    namespace           # called method namespace (e.g.: `forum`)

  data                  # raw data from models

  response              # Response sandbox
    err.code            # (Optional)
    err.message         # (Optional)
    data                # output data (for json or renderer)
                        #     Default: `{widgets: {}}`
    layout              # (Optional) ‘default’ if not set
    view                # (Optional) request.method if not set


  #
  # NOT YET IMPLEMENTED / OBSOLETED
  #


  permissions           # sandbox for calculated permissions cache
  format                # (Optional) Used to force response format,
                        #  when existing view is now enougth (big XML, RSS...)
```

**NOTE**. `env` should not contain functions, to be transparent for
server-server communications. But sometime it's convinient to have some 
session-specific helpers. So, we agree, that such functions should start with
`_`, and they will be missed in server-server communications. Each process
should care itself about initialization of session helpers.


## Filters

Filters are attached via global `nodeca.filter` object:

``` javascript
nodeca.filters.before('forums.threads.show', function (params, next) {
  // once filter done, we can continue to next method in the stack:
  // next filter OR real method itself
  next();
});
```

First argument is node in the server API tree, where we want to assign filter
to. Second is filter function. Method name can be either `String` or `Array` of
strings (when we want attach filter to multiple nodes).

We can attach filters either *before* or *after* controller/action:

- `nodeca.filters.before()`
- `nodeca.filters.after()`

Filters attached as `before` will be called before passing execution to the
action. Filters attached as `after` will be callbed after action will finish
it's work BUT before rendering response.

Assume we have following server API tree:

``` javascript
{
  admin: {
    users: {
      show: function (params, next) {},
      list: function (params, next) {},
      edit: function (params, next) {}
    },
    modules: {
      enable: function (params, next) {},
      disable: function (params, next) {}
    }
  }
}
```

In order to attach filter to all methods of admin module, we can call:

``` javascript
var options = {weight: 200, exclude: ['admin.users', 'admin.users.**']};

nodeca.filters.before('admin', options, function (params, next) {
  // this will apply filter to admin and deeper (forums, forum.operators, etc.),
  // except `admin.users` or any of it's nested childs
  console.log('first');
  next();
});
```

We can apply filter to specific method as well:

``` javascript
var options = {weight: 150};

nodeca.filters.before('admin.users.edit', options, function (params, next) {
  console.log('second');
  next();
});
```

Filters are called from top to the bottom of the tree. For example, upon
`admin.users.edit` call, we will fire filters attached to `admin`, then filters
attached to `admin.users`, then filters attached to `admin.users.edit` and then
action itself.

According to the API tree above and filters, this will lead in echoing to the
console before executing action (mention `weight` option of filters above):

```
second
first
```

You can use `@` as reference to current API tree node:

``` javascript
// file: ./server/admin/users.js

// ...

module.exports.__init__ = function () {
  nodeca.filters.before('@', function (params, next) { /* ... */ });
  // equals to:
  nodeca.filters.before('admin.users', function (params, next) { /* ... */ });

  nodeca.filters.before('@.list', function (params, next) { /* ... */ });
  // equals to:
  nodeca.filters.before('admin.users.list', function (params, next) { /* ... */ });
};
```


See `Hooks` documentation for detailed information about hooks and possible
options (`weight`, `exclude`, etc.).


## Redirect


Sometimes you need to redirect request with 301 or 302 HTTP code. For this
purpose you can pass `Object` with  proper headers and status code:

``` javascript
// file:./server/forum/random_page.js

module.exports = function (params, next) {
  var post, url;

  // get random post here

  url = nodeca.runtime.router.linkTo('forum.posts.show', post);
  next({statusCode: 302, headers: {'Location': url}});
};
```


## Permissions

**NOT YET IMPLEMENTED**

Permissions are special case filters which are defined in a DSL way and then
proposed to the filters:

``` javascript
// file i18n/translation.js
nodeca.permissions.define('allow_translate')
  .test('is_translator_moderator OR is_translator_admin')
  .or('can_create_translation');

nodeca.permissions.define('allow_modify')
  .test('is_translator_moderator OR is_translator_admin')
  .or('can_update_translation AND is_translation_owner');

nodeca.permissions.define('allow_moderate')
  .test('is_translator_moderator OR is_translator_admin');


// attach permission to the filters
nodeca.permissions.before('create').require('allow_translate');
nodeca.permissions.before('save').require('allow_modify');
nodeca.permissions.before([
  'destroy', 'approve', 'activate'
]).require('allow_moderate');
```

Notice that permissions must be checked before action, so in comprison to
filters they provide only `before` chain.
