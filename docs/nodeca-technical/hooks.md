Hooks
=====

General synopsis of hooks attachment is as follows: `(name[, options], func)`.

Names are respecting namespaces, so if you will assign a hook with `foo` name it
will be executed for `foo`, `foo.bar`, `foo.bar.baz` and so on. You can also
assign a *global* hook with `""` (empty string) that will be executed for any
name.

You can specify weight and/or exclude pattern with `options`:

- *weight* (Number): hooks with biggest weight will be executed later in the
  chain. Default: `10`.
- *exclude* (Array): List of exclude patterns (See below).


## Exclude patterns

When assigning a hook, you might provide an `exclude` option as a list of names
you want to avoid. You can use wildcards (`*`, `**`) in the exclude patterns:

- `foo.bar.baz` matches exactly `foo.bar.baz`
- `foo.*` matches `foo.bar`, `foo.baz`, but not `foo.bar.baz` or `foo.baz.bar`
- `foo.**` matches `foo.bar`, `foo.baz`, `foo.bar.baz`, etc.


## Known hooks managers and know hook names


#### nodeca.hooks.init

- *models-tree*:  `nodeca.models` tree population
- *server-tree*:  `nodeca.server` tree population
- *shared-tree*:  `nodeca.shared` tree population
- *client-tree*:  `nodeca.client` tree population
- *settings*:     Settings initialization
- *translations*: Translationsinitialization
- *bundles*:      Static bundler processor
- *router*:       Router initialization


#### nodeca.hooks.models

Each `nodeca.model` is initiated firing hook with it's own name.
For example `nodeca.models.forums.Post` will fire hook `forums.Post`:

``` javascript
nodeca.hooks.models.before('forums.Post', function (model, next) {
  // do something with model (nodeca.models.forums.Post) here
  next();
});
```


#### nodeca.filters

Each `nodeca.server` method is firing a hooks with it's own name.
For example `nodeca.server.forums.posts.show` will fire hook
`forums.posts.show`:

``` javascript
nodeca.hooks.models.before('forums.posts.show', function (params, next) {
  // params here are the same params as given to the method
  // `this` context is an environment of the request
  next();
});
```
