Known global before/after filters (nodeca.filters)
==================================================

**before**

- -9999 - `start_puncher` *nodeca.core/lib/puncher.js*
- -9500 - `get_cookies` *nodeca.core/lib/cookies.js*
- -9000 - `load_session` *nodeca.core/lib/sessions.js*
- -50 - `fetch_my` *nodeca.users/lib/filters/fetch_me.js*
- 50 - `inject_assets_info`  *nodeca.core/lib/inject_assets_info.js*

**after**

- 50 (http only) - `inject_menu` *nodeca.core/lib/inject_menu.js*
  *exclude: common.menus.permissions*
- 50 - `inject_users` *nodeca.users/lib/filters/inject_users.js*
- 50 - `inject_me` *nodeca.users/lib/filters/inject_me.js*
- 900 (http only) - `renderer` *nodeca.core/lib/init/http.js*

**ensure**

- 9000 - `save_session` *nodeca.core/lib/sessions.js*
- 9500 - `set_cookies` *nodeca.core/lib/cookies.js*
- 9999 - `finish_puncher` *nodeca.core/lib/puncher.js*
