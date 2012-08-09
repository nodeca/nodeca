Params Validation
=================

All server methods, must define params validation schema. Any request to the
method without params validation schema will be rejected.


Validation schema
-----------------

See [JSON Schema](http://json-schema.org/) specifications. We support
basic subset, described in [revalidator](https://github.com/flatiron/revalidator)
docs.


API
---

##### nodeca.validate([apiPath, ]schema)

- `apiPath` (String): api path, relative to the current api
   node. Optional, current node by default.
- `schema` (Object): validation schema. Can be in short format, see below.


**EXAMPLE**

``` javascript
// file: server/forum/thread.js

nodeca.validate('show', {
  properties: {
    id: { type: 'integer', minimal: 1 }
  },
  additionalProperties: false
});

module.exports.show = function (params, callback) {
  // ...
};
```

For convenience, we provide a syntax sugar of schema definition:

``` javascript
nodeca.validate({
  id: { type: 'integer', minimal: 1 }
});

// equals to:

nodeca.validate(null, {
  properties: {
    id: { type: 'integer', minimal: 1 }
  },
  additionalProperties: false
});
```

If you use full format, NEVER miss `additionalProperties: false` statement.
In other case, unspecified properties will pass as is, unvalidated. Also,
if you pass nested objects, remember to define `additionalProperties: false`
on each sublevel.