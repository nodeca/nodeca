Filters (nodeca.filters)
========================

We reserve `-99..99` range of weights for _system_ filters and middlewares.
That means that userland filters of server methods should be registered with
weight that is less than -99 or greater than 99.

By default, _nodeca.filters_ registers filters with weight = 100.


Known before/after filters
--------------------------

**before**

* -99 - `start_puncher` *nodeca.core/lib/puncher.js*
* -90 - `get_cookies` *nodeca.core/lib/cookies.js*
* -85 - `load_session` *nodeca.core/lib/sessions.js*
* -80 - `load_current_user` *nodeca.users/lib/filters/load_current_user.js*

**after**

* 50 (http only) - `inject_menu` *nodeca.core/lib/inject_menu.js*
  *exclude: common.menus.permissions*
* 50 - `join_users` *nodeca.users/lib/filters/join_users.js*
* 50 - `inject_current_user_info` *nodeca.users/lib/filters/load_current_user.js*
* 50 (http only) - `inject_assets_info`  *nodeca.core/lib/inject_assets_info.js*
* 90 (http only) - `renderer` *nodeca.core/lib/init/http.js*
* 99 - `finish_puncher` *nodeca.core/lib/puncher.js*

**ensure**

* 90 - `save_session` *nodeca.core/lib/sessions.js*
* 90 - `set_cookies` *nodeca.core/lib/cookies.js*
