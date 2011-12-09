Settings
========

We use concept of "stores" to keep all kinds of settings. For example, to extract permission, we should know
setting name AND groups list. That's why each store is not key/value, but multikey/value storage.

In database, each store is usually binded to 'setting' field of appropriate document. It real life, you should not care
about store deal, because you'll reuse existing ones. Settings are added with yaml files in `config/settings` directory.
Each file can contain multiple settings. We prefer to group those by roles or by store.

Note, that many fields from yaml config are used only in Admin Control Panel.

YAML file structure
-------------------

- **store_name** - Setting store name (e.g. `usergroups`)
    - **key** (unique) - Setting key name (e.g. `can_modify_topic`)
        - **extends** (default = false)- When `true`, means that setting combined
          from several stores. Missed properties taken from base definition.
        - **type**
          (`boolean`|`string`|`text`|`wysiwyg`|`number`|`dropdown`|`combobox`|`usergroups`|`users`|`forums`,
          required) - Type of the setting.
        - **values** - key-value dictionary for `dropdown` and `combobox` types
        - **default** - Default value. If not set, "empty" value used (false, 0, "", [], and so on)
        - **group** - Label used for grouping inside ACP
        - **title** - Title for ACP. If not set, "humanized" *key* used (e.g.
          `can_do_something` => `Can do something`)
        - **description** - Markdown flavoured description for ACP
        - **priority** (default = 10) - Ordering priority for ACP
        - **before_show** - *TBD* JS code executed before showing setting in ACP
        - **before_save** - *TBD* JS code executed before saving setting
        - **validators**
          (`required`|`numeric`|`integer`|`positive_integer`|`regexp`|`custom`,
          optional) - *TBD* reserved for future use
        - **subgroup** - used to simulate logical sub-groups in ACP settings groups


Example
-------

``` yaml
---
usergroups: # store_name
  can_create_thread: # key
    type: boolean
    default: true
    group: Forum permissions
    title: Allow create new thread
    priority: 0

  attachment_limit:
    type: number
    default: 8
    group: Forum limits
    description: Max allowed attachment size in MBytes. 0 (zero) for unlimited.
    priority: 15
    validators:
      required: true
      positive_integer: true

global:
  canonical_friendly_url:
    type: dropdown
    values:
      off: Disabled
      mild: Mild mode
      strict: Strict mode
    default: off
    group: User friendly URLs
    title: Forced canonical URLs
    description: >
      Enables user-friendly URLs support and defines "strategy" of handling
      requests with invalid URL format:

      * Mild mode - redirects user to the correct URL
      * Strict mode - response 404 not found error
```

Existing stores
---------------

- **usergroup** (key, [group1_id, ...]) - stores permissions of user groups. Supports "restrictive" groups.
- **app_users** (key, application, user_id) - stores user lists for applications
    (for example, lists of local administrators/moderators). Has boolean interface (check specific user in list,
    or add/remove user)
- **global** (key)
