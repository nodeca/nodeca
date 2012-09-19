Filters (nodeca.filters)
========================

By default, _nodeca.filters_ registers filters with weight = `0`.


Known before/after filters
--------------------------

**before**

* -90 - `start_puncher` *nodeca.core/lib/puncher.js*
* -85 - `get_cookies` *nodeca.core/lib/cookies.js*
* -80 - `load_session` *nodeca.core/lib/sessions.js*
* -75 (rpc only) - `csrf_protection` *nodeca.core/lib/csrf_protection.js*
* -70 - `load_current_user` *nodeca.users/lib/filters/load_current_user.js*
* -65 - `preset_locale` *nodeca.core/lib/filters/preset_locale.js*

**after**

* 50 (http only) - `inject_menu` *nodeca.core/lib/inject_menu.js*
  *exclude: common.menus.permissions*
* 50 - `join_users` *nodeca.users/lib/filters/join_users.js*
* 50 (http only) - `inject_assets_info`  *nodeca.core/lib/inject_assets_info.js*
* 85 (http only) - `renderer` *nodeca.core/lib/init/http.js*
* 90 - `finish_puncher` *nodeca.core/lib/puncher.js*

**ensure**

* 90 - `save_session` *nodeca.core/lib/sessions.js*
* 90 - `set_cookies` *nodeca.core/lib/cookies.js*
