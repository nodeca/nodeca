Models and Schemas
==================


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
// file  : models/vfs/file.js
// api   : nodeca.model.vfs.file

module.exports = function File() {
  // ...
};
```


Schemas
-------

Mongoose have all methods and helpers attached to schemas, and then, these
schemas are "bounded" to the model. So to allow monkey-patch mongoose models, we
allow to specify mongoose schemas in another place - under `./schemas` directory
so they become available as `nodeca.schema` subtree.

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

As we just said, Mongoose schemas are in fact real model declaration. And
calling `model` function in fact is some kind of compilation. This is an example
of mongoose schema, declared for nodeca forum application:

``` javascript
// file  : schemas/forum/post.js
// api   : nodeca.schema.forum.post
// type  : Mongoose Schema

var PostSchema = module.exports = new Mongoose.Schema({
  author    : ObjectId,
  title     : String,
  body      : String
});


PostSchema
  .virtual('foobar')
  .get(function () {
    // ...
  });
```

You can see that is contains schema structure definition, virtul setters,
getters, static helpers etc. That means that schem will conatain ALL logic,
while your Mongoose models will be skinny. Something like this:

``` javascript
// file  : models/forum/post.js
// api   : nodeca.model.forum.post
// type  : Mongoose Model

module.exports = mongoose_model(nodeca.schema.forum.post);
```

Notice we use `mongoose_model`. We have built-in support of two database related
ORMs: mongoose (MongoDB) and nohm (Redis). As we said before, your model can be
anything, but if you want it to be Mongoose or Nohm model, use `mongoose_model`
or `nohm_model` helpers instead `mongoose.model()` or `nohm.model()`.
