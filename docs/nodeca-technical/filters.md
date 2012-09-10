Known global before/after filters (nodeca.filters)
==================================================

**before**

- -9999 - `start_puncher` *nodeca.core/lib/puncher.js*
- -9500 - `cookies` *nodeca.core/lib/cookies.js*
- -9000 - `sessions` *nodeca.core/lib/sessions.js*
- -900 (http only) - `fix_vhost` *nodeca.core/lib/init/http.js*
- 50 - `inject_assets_info`  *nodeca.core/lib/inject_assets_info.js*

**after**

- 50 (http only) - `inject_menu` *nodeca.core/lib/inject_menu.js*
  *exclude: common.menus.permissions*
- 50 - `inject_users` *nodeca.users/lib/filters.js*
- 900 (http only) - `renderer` *nodeca.core/lib/init/http.js*
- 9999 - `finish_puncher` *nodeca.core/lib/puncher.js*
