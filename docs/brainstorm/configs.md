Configuration Files
===================

All configuration files are kept under `./config` directory. There are no any
restrictions on naming these files. Each file should contain a configuration
tree starting from the root node, in other words their paths are not respected:

``` yaml
--- # file: ./config/routes/foobar.yml
settings:
  usergroups:
    # ...
```

Trees of all config files are merged in one. Each file provides configuration
that starts from the root node of config object, e.g.:

``` yamls
---
router:
  mount:
    # ...
```

will become available as `nodeca.config.routes.mount` object.


Per-environment configs
-----------------------

If file contains `general` section as one of first-level keys, then file will be
treaten as environment dependent and it will result in merging `general` section
with section named the same as current environment (`nodeca.env`):

```
---
general:
  modules:
    nodeca.core: on

development:
  modules:
    nodeca.debug: on
```

Configuration above will become

```
modules:
  nodeca.core: on
  nodeca.debig: on
```

on `development` and:

```
modules:
  nodeca.core: on
```

on any other.


First-level sections
--------------------

Although we do not apply any restrictions on filenames, we restrict list of
first-level sections of config tree. That means that any keys not listed in the
list below and presented in your config file as first-level sections will cause
application error.


-   *i18n*: Translated phrases
-   *router*: Routes configuration (see Router spec)
-   *themes*: Themes configuration (see Themes spec)
-   *settings*: Settings configuration (see Settings spec)
-   *application*: Application specific configuration. This will not become
    part of `nodeca.config`, but will be available as configuration of each
    application it belongs to.
