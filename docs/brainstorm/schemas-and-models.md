Schemas and Models
==================

TBD. intro...

- schemas are structure definitions
- schemas are not supposed to be used directly
- schemas are parts of models
- models (!) may require schemas

...

Schemas are loaded before models:

- load schemas
- fire schemas-loaded hook
- load models


Schemas
-------

Schemas are just document structure definitions. They contain no methods and can
not be used directly. They are used by models, although some models may not have
schemas at all.

Schemas are stored under `./schemas` directory and become available as subtree
under `nodeca.schema`:

```
.
├─ schemas/
│   ├─ foo/
│   │   ├─ bar.js   # nodeca.schema.foo.bar
│   │   └─ ...
│   └─ aha.js       # nodeca.schema.aha
│
└─ ...
```

The object exported by the module (schema file) is used as leaf of the api tree
node. For example:

``` javascript
# file  : schemas/forum/post.js
# api   : nodeca.schema.forum.post
# type  : Mongoose Schema

module.exports = new Mongoose.Schema({
  author    : ObjectId,
  title     : String,
  body      : String
});
```


Models
------

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

The object exported by the module (model file) is used as leaf of the api tree
node. For example:

``` javascript
# file  : models/forum/post.js
# api   : nodeca.model.forum.post
# type  : Mongoose Model

module.exports = new Mongoose.model('Post', nodeca.schema.forum.post);
```

If your model requires "initialization", you can specify `__init__` property as
a function that will be executed once model is loaded:

``` javascript
# file  : models/forum/thread.js
# api   : nodeca.model.forum.thread
# type  : Mongoose Model

module.exports = new Mongoose.model('Thread', nodeca.schema.forum.thread);
module.exports.__init__ = function (callback) {
  console.log('Forum Thread model was loaded...');
  callback(null);
};
```
