Configuration Files
===================

All configuration files are kept under `./config` directory. There are no any
restrictions on naming of these files. Each file should contain a configuration
tree starting from the root node, in other words their paths are not respected.

All trees are merged together. Values from main application config are taking
precedence. There's an exact list of first-level keys available in config files
other than those keys will be ignored.


Available sections
------------------

### applications

Holds config specific for separate applications.
Second level of the section should be application name and it's state on/off.

*Example:*

``` yaml
applications:
  nodeca.core: on
  nodeca.forum: on
  nodeca.debug: off
```


### listen (main app only)

Holds configuration of where HTTP server should be bounded. This will become
"default mount point" as well.

Listen can hold two inner options:

- **host** (Default: `localhost`)
- **port** (Default: `3000`)

*Example:*

``` yaml
listen:
  host: localhost
  port: 3000
```


### database (main app only)

Holds configuration of connection databases.

Possible inner keys (with options):

- **redis**: Connection options of Redis.
- **mongo**: Connection options of MongoDB.

*Example:*

``` yaml
database:
  redis:
    host: localhost
    port: 6379
    index: 0

  mongo:
    host: localhost
    port: 27017
    database: nodeca
    user: mongol
    password: shuudan
```


### locales (main app only)

Holds configuration of enabled and default locale(s).

Possible inner keys:

- **enabled**: Array of enabled locales. Default: all found locales.
- **default**: Default locale. Default: first enabled locale.

*Example:*

``` yaml
locales:
  enabled:
    - en-US
    - en-GB
    - ru-RU

  default: ru-RU
```


### i18n

Holds translation phrases.
Second level of the section should be locale.

*Example:*

``` yaml
i18n:
  en-US:
    admin:
      dashboard:
        registration_stats: >
          Since your last visit on #{last_visit} there were #{noobs_count}
          new %{user|users}:noobs_count. Please, review #{noobs_review_link}.
        pending_registrations: pending registrations
```


### theme\_schemas

Holds theme configuration.
Second level of the section is theme id.

See [themes config specification][themes] for details.

*Example:*

```yaml
theme_schemas:
  desktop-default:
    name: Default Default Theme

  deep-purple:
    name: Deep Purple Desktop Theme
    inherits: desktop-default
```


### themes (main app only)

Holds white/black list of themes.

*DEFAULT: whitelist all installed themes*

You can specify whenether you want whitelist of blaklist by using special
tag `!whitelist` or `!blacklist`. By default (if no tag provided) we treat
the value as whitelist.

*Example:*

``` yaml
themes: !blacklist
  - red-hot-moon
  - deep-purple
```


### setting\_schemas

Holds configuration of settings definitions for building admin interface.
TBD: Describe info about stores etc.

*Example:*

``` yaml
setting_schemas:
  app_users:
    nodeca.forum:
      can_admin:
        title: Allow administrate forum application
        default: false
        type: boolean
```


### settings (main app only)

Holds values of `global` settings store.
See [settings][settings] specifications for details.

*Example:*

``` yaml
settings:
  results_pre_page: 25
```


### routes

Holds routes for server methods.

Routes are defined for server methods and merged by default.
You may provide routes with `!clean` tag in main application config to override
all routes of given server method.

See [router specification][router] for details.

*Example:*

``` yaml
routes:
  admin.dashboard:
    "/admin": ~

  forum.list:
    "/f{forum_id}/":
      forum_id: /\d+/

    "/f{forum_id}/index{page}.html":
      forum_id: /\d+/
      page: /[2-9]|[1-9]\d+/

  blog.posts.show: !clean
    "/{id}-{slug}.html":
      id: /\d+/
```


### redirects (main app only)

Holds redirections map.

See [router specification][router] for details.

*Example:*

``` yaml
redirects:
  "/f{forum_id}/thread{thread_id}.aspx":
    to: "/t-{forum_id}-{thread_id}.html"
    code: 301
    params:
      forum_id: /\d+/
      thread_id: /\d+/
```

### direct\_invocators

Holds list of server methods that may be used directly via HTTP.

See [router specification][router] for details.

Just like routes, directo invocators are merged by default, but you can describe
them with `!clean` tag in orver to override all invocators in main app.

*Example:*

``` yaml
direct_invocators:
  forums.threads.show: on
  forums.threads.update: off
```


### mount (main app only)

Holds configuration of mount points.

See [router specification][router] for details.

*Example:*

``` yaml
mount:
  # Mount all nodeca.server.forum.* methods under domain `forums.nodeca.org`
  forum:  //forums.nodeca.org

  # Mount all ndoeca.server.blog.* methods under path `/blogs`
  blog:   /blogs
```


Per-environment configurations
------------------------------

You may also specify a per-environment configuration. For this purposes we allow
to specify environment names as first-level sections (real config becomes
nested) with caret (`^`) prefix.

NOTICE that sections described on firs-level (without environment) arec
onsidered as `general`, so they are pplied for any environment. Also,
environment-specified options tak precedence over general.

In the example below, `listen` will become:

- when `NODECA_ENV=production`: `{host: nodeca.org, port: 80}`
- when `NODECA_ENV=development`: `{host: localhost, port: 8080}`
- else: `{host: localhost, port: 80}`

*Example:*

``` yaml
listen:                   # applied to any environment
  host: localhost
  port: 80

^production:              # applied to `production` environment
  listen:
    host: nodeca.org
    port: 80

^development:             # applied to `development` environment
  listen:
    port: 8080
```


[themes]:   https://github.com/nodeca/nodeca/blob/master/docs/nodeca-technical/themes.md
[settings]: https://github.com/nodeca/nodeca/blob/master/docs/nodeca-technical/settings.md
[router]:   https://github.com/nodeca/nodeca/blob/master/docs/nodeca-technical/router.md
