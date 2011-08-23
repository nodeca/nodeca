Settings and Permissions
========================

Settings
--------

Each settings consist of:

- name, simple string, e.g. `max_open_posts`
- definition, mixed type.

Definitions of each settigns may be:

- simple
-- boolean
-- array


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
