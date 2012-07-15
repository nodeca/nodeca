Views Renderer
--------------

Views renderer is an after-filter middleware.

Render expect environment to contain `response` object (see Request Environment)
with properties:

- **data** raw output data (used as JSON output or as sandbox for views)
- **layout** name to use (when rendering HTML)
- **view** name to use (when rendering HTML or sending data to the client)

If error occurs, `env.response` will have these fields as well:

- **err.code** (Integer)
- **err.message** (String)

When request comes from RT origin, we simply pass `env.response` object to the
callback, while upon HTTP request we can return it as JSON or as rendered HTML
depending on requested `format`. By default upon HTTP request we render HTML and
return it. When `format` is *JSON* we return whole `env.response` serialized.

We look for the requested format in following places (first one found is used):

- `env.format`
- `env.params.format`

**NOTICE** `html` renderer expect presence of `env.language` and `env.skin` in
order to choose correct view. If it wasn't, we use default language (en) and
skin (default) instead.


## Helpers and Variables

**NOT YET IMPLEMENTED**

We provide constants available in templates on both server and client:

- **ASSETS**: Base URL of assets, e.g. `/assets/`
- **THEME**: Base URL of current theme assets, e.g. `/assets/theme-desktop-red/`

### Helpers

##### asset_path(logicalPath)

Retuns full URL to asset (with digest)


##### asset_include(logicalPath) -> String

Returns bundled source of asset (asset should be precompiled)


##### date(dateObjectOrString, format) -> String

- dateObjectOrString (Date|String): Date object, or date string.
- format (String): Output format `time`, `date`, `datetime` or `iso8601`.
