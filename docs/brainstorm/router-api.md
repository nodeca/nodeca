Router API
==========

Route matching may contain:

- `{varname}` - substitution of param
- `(...)` - marks inner contents as optional

For example `/users/{id}(.{format})` matches:

- `/users/123` (id: 123, format: null)
- `/users/123.html` (id: 123, format: html)


router.js
---------

``` javascript
/**
 *  - api (Object): Nodeca API tree
 *
 *  Create new instance of router.
 */
function Router(api) {}


/**
 *  - match (String): Route string
 *  - options (Object): Route options (See Router description)
 *
 *  Adds singe route definition
 **/
Router.prototype.addRoute = function addRoute(match, options) {};


/**
 *  - mount (String): Mount point (See Router description)
 *  - apiNode (String): Leaf or branch from of API tree
 *
 *  Mounts api tree methods under given mount point
 **/
Router.prototype.setMountPoint = function setMountPoint(mount, apiNode) {};


/**
 *  - fn (Function): Called if no matching routes found.
 **/
Router.prototype.setNotFoundHandler = function setNotFoundHandler(fn) {};


/**
 *  - request (String): Full URL (with hostname)
 *  - callback (Function): Passed to the route's handler.
 **/
Router.prototype.dispatch = function dispatch(request, callback) {};
```
