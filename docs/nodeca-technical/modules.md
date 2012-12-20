Intro
-----

Application structure is inspired by different "scaleable" metodologies.
In practice that means:

- Split all to independed modules (can be nested)
- All module resources (js, views, i18n, ...) are in single folder
- No global modules availability - use events or local requires

That's acheaved via advanced bundler. Note, that we don't have local config
for each module, as in BEM. Instead, we use global rules for each resource type.
That's more simple in our case.


Resources / bundler
-------------------

All resources are separated to namespaces. Each namespace produces `package`.
Packages are combined into `bundles` for loading optimisation. Here is typical
config:

``` yaml
---
bundles:

  frontend:
    - lib
    - common
    - forum
    - user

  backend:
    - lib
    - admin

packages:

  forum:

    depends:
      - lib
      - common

    server:
      root:    "./server/forum/"
      include: "*.js"
      exclude: "/(^|\/)_.*/"

    models:
      root:    "./models/forum/"
      include: "*.js"
      exclude: "/(^|\/)_.*/"

    stores:
      root:    "./stores/forum/"
      include: "*.js"
      exclude: "/(^|\/)_.*/"

    i18n_server:
      root:    "./server/forum/"
      include: "i18n/*.yml"

    client:
      root:    "./client/forum/"
      include: "*.js"
      main:    "app.js"
      exclude: "/(^|\/)_.*/"

    views:
      root:    "./client/forum/"
      include: "*.jade"
      exclude: "/(^|\/)_.*/"

    styles:
      root:    "./client/forum/"
      main:    "app.styl"
      include: "*.styl"

    i18n_client:
      root:    "./client/forum/"
      include: "i18n/*.yml"

    bin:
      root:    "./client/forum/"
      include: "/\.(gif|png|otf|ttf|svg)$/"

  lib:

    client:
      root:    "./assets/"
      main:    "app.js"

    styles:
      root:    "./assets/"
      main:    "app.styl"

    bin:
      root:    "./assets/"
      include: "/\.(gif|png|otf|ttf|svg)$/"
```

(!) Sequience of module's JS/CSS should not make sense (use BEM's naming rules).
The only exclusion are libraries. Then define `main` app, which can use mincer's
directives. It can be ommited, if not needed.


Local helpers, to simplify resources include
--------------------------------------------

We support extentions for jade / stylus / node, to simplify resource include:

- `@` means root of package:
  - `@/path` - from the root of current package
  - `@package/path` - from the root of foreign package
- `^` means root of application:
  - `^/path` - from the root of current application
  - `^app_name/path` - from the root of foreign application
- i18n names are always relative to current module
- on client code, `require` automaticcaly bundle code, if not exists in
  any package

Helpers:

- `require` in node is not extended / monkey-patched
- `require` in client
  - understands `.` (relative to current path)
  - understands `@`
  - understands `^`
  - bundles code
- `self.include()` (helper, do not miss with `include` directive) in jade
  - understands `@`
  - autopatch relative i18n paths
- `import` in stylus
  - understands `@` (TBD)

