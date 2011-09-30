Settings And Permissions
========================


Setting definition
------------------

- **store_name** - Setting store name (e.g. `usergroups`)
    - **key** (unique) - Setting key name (e.g. `can_modify_topic`)
        - **type** (`boolean`|`string`|`text`|`wysiwyg`|`number`|`dropdown`|`combobox`|`usergroups`|`users`|`forums`, required) - Type of the setting.
        - **default** (optional) - Default value
        - **group** (optional) - Group title
        - **title** (required) - Title for ACP
        - **description** (optional) - Markdown flavoured description for ACP
        - **priority** (optional, default = 10) - Ordering priority for ACP
        - **before_show** (optional) - JS code executed before showing setting in ACP
        - **before_save** (optional) - JS code executed before saving setting
        - **list_values** (optional) - key-value dictionary for `dropdown` and `combobox` types
        - **validators** (optional) - tdb. reserved for future use

Retreiving value for the key
----------------------------




Default values
--------------

Default value of setting may be omitted (see *When no defaults specified*)
or given as mixed type value, e.g.:

    can_read_forum:
      type: boolean
      default: true

All default values are non-restrictive. In other words if by some reason we
failed find value of given key in the database while checking permissions, then
default vlue will be returned non-restricive (with `strict` flag equal `false`).


When no defaults specified
--------------------------

All defned settings are loaded during initialization stage. And every setting
defined without `default` value will be defined with auto-guessed default value
according to its type.

    type        => default value
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    boolean     => false
    numeric     => 0
    array       => []
    string      => ''
    object      => {}

All auto-guessed default values would be non-restrictive, e.g. this definition:

    can_admin_translator:
      type: boolean

Will be the same as:

    can_admin_translator:
      type: boolean
      default: false
