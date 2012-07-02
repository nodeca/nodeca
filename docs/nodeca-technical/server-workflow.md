Middlewares
-----------

When you add your own middlewares to the stack, consider that middleware
weights in range of 0-1000 are reserved for system middlewares only.


Server methods (and middlewares) signature
------------------------------------------

``` javascript
function (req, res, next) {
  // do something with request, or even with response and then call next
  // or interrupt midllewares stack by calling res.end()
}
```


Extra properties added to request object
----------------------------------------

#### origin

Possible values: `HTTP` | `REALTIME`


#### params

In case of `HTTP` - contains mixed params of GET, POST, and those provided to
router: `_.extend({}, req.queryParams, req.formData, routerParams)`. In case of
`REALTIME` - exactly params provided to `apiTree` call.


#### skip

Array of middlewares to skip


DO NOT FORGET
-------------

- We must override `res.end` and destroy `middlewares` stack once it's being
  called in order to not bloat memory - hooker must provide a method to do so.
