Known global before/after filters (nodeca.filters)
==================================================


- before, -9000,  *http|rt*,  `start_puncher`       *nodeca.core/lib/puncher.js*
- before, -900,   *http*,     `fix_vhost`,          *nodeca.core/lib/init/http.js*
- before, 50,     *http|rt*,  `inject_assets_info`  *nodeca.core/lib/inject_assets_info.js*
- after,  50,     *http*,     `inject_menu`         *nodeca.core/lib/inject_menu.js*
  *exclude: common.menus.permissions*
- after,  50,     *http|rt*,  `inject_users`        *nodeca.users/lib/filters.js*
- after,  900,    *http*,     `renderer`,           *nodeca.core/lib/init/http.js*
- after,  9000,   *http|rt*,  `finish_puncher`      *nodeca.core/lib/puncher.js*
