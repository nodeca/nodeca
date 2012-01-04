# Server Modules

All modules/methods from `server` folder will be mapped to API Tree under `nodeca.server` scope.
Those items will be also publically to clients (via streams). Example:
example:

```
├─ server/
│   └─ admin/
│       ├─ dashboard.js
│       └─ users.js
└─ internal/
    └─ ...
```

Note, we reserve `internal` folder for server-server IPC. For example, when you like to run
isolated process to log money transaction and so on.

Every module can have 1 or multiple methods. All `exports` are mapped to API Tree. See examples below.

``` javascript
// file: admin/users.js

module.exports.list = function list(param1 [, param2...], cb) {
  // ...
};

module.exports.show = function show(param1 [, param2...], cb) {
  // ...
};
```

or provide exactly one method:

``` javascript
// file: admin/dashboard.js
module.exports = function (param1 [, param2...], cb) {
  // ...
};
```

## Module Initialization

For modules initialization we use `__init__` method which is called (if exists)
after module was required. This method is called with the only argument:

- `nodeca`: Reference to root node of the API tree

``` javascript
module.exports.list = function list(forum_id, sort_by, cb) { /* ... */ };

// ...

module.exports.__init__ = function (nodeca) {
  nodeca.filters.after('list', function (next) {
    // See filters for details...
  });
};
```

Module initialization is needed to guarntee that your filters and permissions
will be attached after nodes were attached to the server tree.


## Method Invocation

Every method should have callback as last argument. Other args can be of any type.

Methods are executed in context of request enviroment (See Request Environment).
So, you can access session info and other request data. You can attach `before`
and `after` filters for your methods, which are called prior and after method:

*NOTICE* that filters in comparison to methods have only one argument regardles
to the argumetns of method itself.

``` javascript
module.exports.list = function list(params, next) {
  console.log('method: ' + this.test);
  next();
};


module.exports.__init__ = function (nodeca) {
  nodeca.filters.before('list', function (next) {
    this.test = 1;
    console.log('filter 1: ' + this.test);
    next();
  });

  nodeca.filters.before('list', function (next) {
    this.test += 2;
    console.log('filter 2: ' + this.test);
    next();
  });

  nodeca.filters.after('list', function (next) {
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

All requests are executed within separate context, with `env` structure available:

```
env:                            # this.env, in context

  _t                            # babelfish.t proxy, without `language` param
  permissions                   # sandbox for calculated permissions cache
  format                        # (Optional) Used to force response format,
                                #  when existing view is now enougth (big XML, RSS...)

  session                       # session data
    session_id
    user_id
    language
    theme

  request                       # request details
    origin (RT|HTTP)            # invocation method (readltime [websocket] / legacy [http])
    method                      # called method name (e.g.: ‘forum.posts.show’)

  response                      # Response sandbox
    err.code                    # (Optional)
    err.message                 # (Optional)
    data                        # raw output (for json or renderer) (Default: null)
    layout                      # (Optional) ‘default’ if not set
    view                        # (Optional) request.method if not set
```

**NOTE**. `env` should not contain function, to be transparent for server-server communications.
But sometime it's convinient to have some local helpers. So, we agree, that functions should start
with `_`, ant they will be missed in server-server communications. Each process should care itself
about initialization of local helpers.


## Filters

Filters are attached via global nodeca filter object:

``` javascript
nodeca.filters.before('forums.threads.show', function (next) {
  // once filter done, we can continue to next method in the stack:
  // next filter OR real method itself
  next();
});
```

First argument is node in the server API tree we want to attach filter to,
second is filter function. Method name can be either `String` or `Array` of
strings (when we want to attach to multiple nodes).

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
      show: function () {},
      list: function () {},
      edit: function () {}
    },
    modules: {
      enable: function () {},
      disable: function () {}
    }
  }
}
```

In order to attach filter to all methods of admin module, we can call:

``` javascript
nodeca.filters.before('::admin', function (next) {
  // this will apply filter to admin and deeper (users, users.show, etc)
  console.log('first');
  next();
});
```

We can apply filter to specific method as well:

``` javascript
nodeca.filters.before('::admin.users.edit', function (next) {
  console.log('second');
  next();
});
```

Filters are called from top to the bottom fo the tree. For example, upon
`admin.users.edit` call, we will fire filters attached to `admin`, then filters
attached to `admin.users`, then filters attached to `admin.users.edit` and then
action itself.

According to the API tree above and filters, this will lead in echoing to the
console before executing action:

```
first
second
```

Prefix `::` in the method name means start looking from the root of the server
subtree, but when you describe module `admin.users` and want to attach a filter
on `admin.users.list` you may obey '::admin.users.` prefix:

``` javascript
// file: ./server/admin/users.js

module.exports.list = function list() { /* ... */ };

// ...

module.exports.__init__ = function (nodeca, filters, permissions) {
  filters.before('list', function () { /* ... */ });
  // equals to:
  filters.before('::admin.users.list', function () { /* ... */ });
};
```

You can use `@` as reference to current API tree node:

``` javascript
// file: ./server/admin/users.js

// ...

module.exports.__init__ = function (nodeca, filters, permissions) {
  filters.before('@', function () { /* ... */ });
  // equals to:
  filters.before('::admin.users', function () { /* ... */ });

  // you can use @ as prefix

  filters.before('list', function () { /* ... */ });
  // equals to:
  filters.before('@.list', function () { /* ... */ });
  // equals to:
  filters.before('::admin.users.list', function () { /* ... */ });
};
```


## Permissions

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
