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

Each permission must be defined in the application:

``` javascript
var app = new nodeca.Application(__dirname, function bootstrapper() {
  var config = this.config; // shortlink

  this.define_permission('delete-post', function (next) {
    var err, // error object if any
        decision; // boolean true/false - represents allow/deny
    next(err, decision);
  });
});
