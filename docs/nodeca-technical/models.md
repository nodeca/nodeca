Models
======

Models represents business layer and hides realization under the hood. That
means that models may be or may not be connected to the database (e.g. we may
have model that works with files).

Models are stored under `./models` directory and become available as subtree
under `nodeca.model`:

```
.
├─ models/
│   ├─ foo/
│   │   ├─ bar.js   # nodeca.model.foo.bar
│   │   └─ ...
│   └─ aha.js       # nodeca.model.aha
│
└─ ...
```


Simple case
-----------

That's similar to server module: single or several functions can be exported.

_Single model:_

``` javascript
// file : models/vfs/file.js
// api  : nodeca.model.vfs.file

module.exports = function File() {
  // ...
};
```

_Several models:_

``` javascript
// file : models/user.js
// api  : nodeca.model.user.create, nodeca.model.user.remove 

module.exports.create = function create(..., cb) {
  // ...
};

module.exports.remove = function remove(..., cb) {
  // ...
};
```


Complex cases
-------------

Sometime we need multi-stage model init. For example, in mongoose. In this case
magical `__init__` method should be exported (similar to server module). Init
sequence wll be the following:

- model file loaded via `require`
- hooks applied to this module
- `__init__` called, and result mapped to model tree.

``` javascript
// file  : model/blog/entry.js
// api   : nodeca.model.blog.entry

var mongoose = nodeca.runtime.mongoose;

var Comments = module.exports.Comments = new mongoose.Schema({
    title     : String
  , body      : String
  , date      : Date
});

var Entry = module.exports.BlogPost = new mongoose.Schema({
    author    : ObjectId
  , title     : String
  , body      : String
  , date      : Date
  , comments  : [Comments]
  , meta      : {
        votes : Number
      , favs  : Number
    }
});

module.exports.__init__ = function() {
  return mongoose.model('entry', Entry);
};
```


### Hooks

When we like to modify model, it can be done via hooks. Simple models can be
changed via init phase hooks. Complex models (mongoose) require intrussion after
schema load. That can be done with model hooks.

``` javascript
nodeca.hooks.models.on('forum.posts', [priority=10, ]function (model) {
  /* ... */
});
```

We define model path to track, priority (optional, when multiple hooks), and 
monkeypatching function. Function takes exported model data and to anything it
wish. Call is synchroneous.

Example:

``` javascript
function lastModPlugin(schema, options) {
  schema.add({ lastMod: Date });

  schema.pre('save', function (next) {
    this.lastMod = new Date;
    next();
  })

  if (options && options.index) {
    schema.path('lastMod').index(options.index);
  }
}

nodeca.hooks.models.on('blog.entry', 5, function (model) {
  model.Comments.plugin(lastModPlugin);
  model.Entry.plugin(lastModPlugin, {index: true});
}
```
