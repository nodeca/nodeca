Server Modules
--------------

We create API tree on FS structure basis mostly. So, `nodeca.server` tree is
filled y methods from modules under `./server/` directory of applications.
Each file or directory lead into new node of API tree. Let's take simple
example:

-   ./server/
    -   ./admin/
        -   ./dashboard.js
        -   ./users.js

According to the files above we can say that our API tree consist of at least:
`nodeca.server.admin.dashboard` and `nodeca.server.admin.users`.

Each server module can be a set of methods, e.g.:

``` javascript
// file: admin/users.js
module.exports.list = function (params, cb) {
  // ...
};

module.exports.show = function (params, cb) {
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

Methods of server API tree are accessible only within server by default, they
are not exposed to client or available for server-server IPC. To make method
get exposed to the client, you need to set `_public` property of method to
`true`. To make method available for server-server IPC, you need to set
`_internal` property of method to `true`, e.g.:

``` javascript
// file: admin/users.js
module.exports.list = function () { /* ... */ };

// expose nodeca.server.users.list to the clients and allow to call from
// external (word-wide) resources (wesockets)
module.exports.list._public = true;

// expose nodeca.server.users.list for internal usage (server-server IPC)
module.exports.list._internal = true;

// ...
```

As specifying public and internal properties of methods within module that
exports multiple methods is a boring task, you can specify a list of public and
internal methods as arrays:

``` javascript
// file: admin/users.js
// ...

module.exports._public = [ 'list', 'show', 'edit', /* ... */ ];
module.exports._internal = [ 'list', 'edit', /* ... */ ];
```


Filters
=======

Filters are attached via global nodeca filter object:

``` javascript
nodeca.filters.add('forums.threads.show', function (next) {
  var env = this;
  // once filter done, we can continue to next method in the stack:
  // next filter OR real method itself
  next();
});
```

First argument is node in the server API tree we want to attach filter to,
second is filter function. Method name can be either string or array of strings
if we need to attach to multiple nodes.

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
nodeca.filters.add('admin', function (next) {
  // this will apply filter to admin and deeper (users, users.show, etc)
  console.log('f1');
  next();
});
```

We can apply filter to specific method as well:

``` javascript
nodeca.filters.add('admin.users.edit', function (next) {
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


Permissions
===========

TBD (how we assign permissions via filter)
