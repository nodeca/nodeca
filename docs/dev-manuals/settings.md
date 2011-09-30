Settings
========


Definition
----------

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
