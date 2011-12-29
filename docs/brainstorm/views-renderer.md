Views Renderer
--------------

Views renderer called once ation and it's filters were run (see Request
Lifecycle) on _render response_ stage.

Render expect environment to contain `response` object which consist of
`format -> data` pairs, e.g.:

``` javascript
env.response = {
  json: user,
  html: 'users.show'
};
```

We support two formats:

- **json**: (Object) data should be an object that will be serialized as response
- **html**: (String) view name that should be rendered

You can define your own renderer by adding a rendering function to the renderer:

``` javascript
nodeca.renderers.add('jade', function (data, callback) {
  var err, result;
  // do something with data, and return result.
  // - result must be a string on success
  // - result is ignored if err presents
  callback(err, result);
});
```

Renderer use format given as `env.format`. If `env.response` has no such format,
or renderer has no rendering function for given `env.format` an application
error is raised. Although we are trying to preselect `env.format` based on
request origin (*json* for RT and *html* for HTTP).

We can describe process of "selecting" format as follows (pseudo-code):

```
default = case req.origin
          when 'RT'         => 'json'
          when 'HTTP'       => ''
          else              => undefined

format  = env.format OR req.params.format OR default
```

**NOTICE** `html` renderer expect preence of `env.language` in order to choose
correct i18n view. If it wasn't presented, it will use default language (en)
instead.
