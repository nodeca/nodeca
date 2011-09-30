Settings And Permissions
========================


Setting definition
------------------

- **store_name** - Setting store name (e.g. `usergroups`)
    - **key** (unique) - Setting key name (e.g. `can_modify_topic`)
        - **type** (`boolean`|`number`|`string`|`array`|`object`, required) - Type of the setting.

---

    * group id (string) used to group permissions inside ACP
    * override (bool) (optional) marks permission as override of another one
    * priority (integer)
    * title (string)
    * description, markdown flavoured text, (optional)
    * default (mixed)
    * type
      * bool
      * string
      * text
      * wysiwyg
      * number
      * drop down box
      * multi select
      * user group list
      * user list
      * forums list
    * list of values (for lists only) Hash
    * validator (hash)
      * name, String
        * custom
        * numeric
        * integer
        * positive integer
        * regexp
      * options, String (regexp|eval)
    * before show, String (eval)
    * before save, String (eval)
    * subgroup title (string) (optional)
    * used to simulate logical sub-groups in ACP settings groups

---

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
