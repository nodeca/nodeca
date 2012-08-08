Params Validation
=================

All server methods, must define params validation schema. Any request to the
method without params validation schema will be rejected.


API
---

##### nodeca.validate([apiPath, ]schema)

- `apiPath` (String): api path relative to the current api node
- `schema` (Object): validation schema


**EXAMPLE**

``` javascript
// file: server/forum/thread.js

nodeca.validate('forum.thread.show', {
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
{
  id: { type: 'integer', minimal: 1 }
};

// equals to:

{
  properties: {
    id: { type: 'integer', minimal: 1 }
  },
  additionalProperties: false
};
```



**TBD** Different deny/allow policies (e.g. drop params, etc.)
