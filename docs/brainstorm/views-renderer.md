Views Renderer
--------------

Views renderer called once ation and it's filters were run on _render response_
stage.

Render expect environment to contain `response` object (see Request Environment)
with properties:

- **data** raw output data (used as JSON output or as sandbox for views)
- **layout** name to use (when rendering HTML)
- **view** name to use (when rendering HTML or sending data to the client)

When request comes from RT origin, we simply pass `env.request` object to the
callback, while upon HTTP request we can return it as JSON or as rendered HTML
depending on requested `format`. By default upon HTTP request we render HTML and
return it. When `format` is *JSON* we return serialized `response.data`.

We look for the requested format in following places (first one found is used):

- `env.format`
- `env.params.format`

**NOTICE** `html` renderer expect presence of `env.language` in order to choose
correct i18n view. If it wasn't, we use default language (en) instead.
