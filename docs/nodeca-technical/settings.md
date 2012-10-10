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
        - **category** - Label used for grouping inside ACP
        - **priority** (default = 10) - Ordering priority for ACP
        - **before_show** - *TBD* JS code executed before showing setting in ACP
        - **before_save** - *TBD* JS code executed before saving setting
        - **validators**
          (`required`|`numeric`|`integer`|`positive_integer`|`regexp`|`custom`,
          optional) - *TBD* reserved for future use
        - **subgroup** - used to simulate logical sub-groups in ACP settings groups

`<key>_title` & `<key>_description` are defined in lang files. Description can
use markdown.

Path for settings category names localizations is `admin.setting.category.<category_name>` while path of the settings itself is `admin.setting.<setting_name>` for name and `admin.setting.<setting_name>_help` for help phrase

Example
-------


``` yaml
---
setting_schemas:
  global:
    threads_per_page:
      type: number
      category: forum
      default: 30

    posts_per_page:
      type: number
      category: thread
      default: 25
```

``` yaml
i18n:
  en-US:
    admin:
      setting:
        category:
          forum: Forum
          thread: Thread

        threads_per_page: Threads per page
        threads_per_page_help: Default number of displayed thread 

        posts_per_page: Posts per page
        posts_per_page_help: Default number of displayed posts

```

Existing stores
---------------

- **usergroup** (key, [group1_id, ...]) - stores permissions of user groups. Supports "restrictive" groups.
- **app_users** (key, application, user_id) - stores user lists for applications
    (for example, lists of local administrators/moderators). Has boolean interface (check specific user in list,
    or add/remove user)
- **global** (key) - maps settings from config file, to use in filters
