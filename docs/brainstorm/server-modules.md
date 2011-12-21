Server Modules
--------------

TBD (how methods are got published)

Filters
=======

*WIP*

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
