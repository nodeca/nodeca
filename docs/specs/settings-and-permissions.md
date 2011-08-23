Settings and Permissions
========================

Settings
--------

Each settings consist of:

* name, string, e.g. `max_open_posts`
* value, mixed type

Value of each settigns may be:

* boolean
* string
* integer
* array

Value may be complex object as well, e.g.:

``` yaml
allow_delete_post:
  must_be_owner: true
  during_period: 30 mins
  must_be_last_post: true
```

By default latest definition overrides previous one. But sometimes you need
completely remove value, for this purpose use delete tag:

``` yaml
allow_delete_post: !delete
```

_NOTICE_ Value of `!delete` tag is not used at all, so these two variants are
absolutely equal:

``` yaml
allow_delete_post: !delete true
allow_hang_the_dj: !delete false
```


Permissions
-----------

Permissions are precompiled functions that allows or denies specific actions,
e.g.:

``` javascript
var PostsController = function PostsController() {
  // ...
  this.before('delete', app.requires_permission('delete-post'));
  // ...
};
```

Each permission must be defined in the application as function that accespts two
params: `req` and `next`:

``` javascript
var app = new nodeca.Application(__dirname, function bootstrapper() {
  var config = this.config; // shortlink

  this.define_permission('delete-post', function (req, next) {
    var err; // error object should be defined if access is forbidden
    next(err);
  });
});
