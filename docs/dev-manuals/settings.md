Settings
========


Definition
----------

- **store_name** - Setting store name (e.g. `usergroups`)
    - **key** (unique) - Setting key name (e.g. `can_modify_topic`)
        - **type**
          (`boolean`|`string`|`text`|`wysiwyg`|`number`|`dropdown`|`combobox`|`usergroups`|`users`|`forums`,
          required) - Type of the setting. If not set, "empty" value used (false, 0, "", [], and so on)
        - **default** - Default value
        - **group** - Label used for grouping inside ACP
        - **title** (required) - Title for ACP
        - **description** - Markdown flavoured description for ACP
        - **priority** (default = 10) - Ordering priority for ACP
        - **before_show** - JS code executed before showing setting in ACP
        - **before_save** - JS code executed before saving setting
        - **list_values** - key-value dictionary for `dropdown` and `combobox` types
        - **validators** - *TBD* reserved for future use


Example
-------

``` yaml
---
usergroups: # store_name
  can_moderate_translator: # key
    type: boolean
    default: false

```      
