Server Modules
--------------

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

Every method should have callback as last argument. Other args can be of any type.

Methods are executed in context of request enviroment (See Request Environment).
So, you can access session info and other request data. There are also special
filters to attach validators and tata midifiers prior and after method call.

For modules initialization `__init__` method is used:

``` javascript
module.exports.list = function list(forum_id, sort_by, cb) { /* ... */ };

// ...

module.exports.__init__ = function () {
  // `this` consist of (nodeca, before, after):

  this.after('list', function (next) {
    // See filters for details...
  });
};
```

Module initialization is executed in a special context that provides some
shorthand references to:

- `after`: See Filters#after
- `before`: See Filters#before
- `nodeca`: Root node of the API tree

Request Environment
===================

All requests are executed within separate context, with following structure:

-   *origin*: Mandatory. Specifies origination of request.
    Possible values: `HTTP`, `WebSocket`
-   *session*: Mandatory. Contains all information realted to the session.
    -   *user*: Optional. Represents current user (if authenticated)
-   *request*: Mandatory. Original request
    -   *uri*: Mandatory. Requested URI.
    -   *query*: Mandatory. Strign with query (after question mark).
    -   *params*: Optional. Merge of hashes:
        -   GET query
        -   POST data
        -   Router params

Filters
=======

Filters are attached via global nodeca filter object:

``` javascript
nodeca.filters.before('forums.threads.show', function (next) {
  var env = this;
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
  console.log('f1');
  next();
});
```

We can apply filter to specific method as well:

``` javascript
nodeca.filters.before('::admin.users.edit', function (next) {
  console.log('f2');
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
f1
f2
```

Prefix `::` in the method name means start looking from the root of the server
subtree, but when you describe module `admin.users` and want to attach a filter
on `admin.users.list` you may obey '::admin.users.` prefix:

``` javascript
// file: ./server/admin/users.js

module.exports.list = function list() { /* ... */ };

// ...

module.exports.__init__ = function () {
  this.before('list', function () { /* ... */ });
  // equals to:
  this.before('::admin.users.list', function () { /* ... */ });
};
```


Permissions
===========

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
nodeca.permissions.before('create', 'allow_translate');
nodeca.permissions.before('save', 'allow_modify');
nodeca.permissions.before([ 'destroy', 'approve', 'activate' ], 'allow_moderate');
```

