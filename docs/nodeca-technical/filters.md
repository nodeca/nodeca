Known global before/after filters (nodeca.filters)
==================================================


##### base\_assets (before, 50)

*source:* `nodeca.core/lib/base_assets.js`

Middleware that populates `env.response.head.assets` with generic assets
needed for the given method (based on locale, theme and namespace).


##### start_puncher (before, -9000)

*source:* `nodeca.core/lib/puncher.js`

Middleware that marks start of the request


##### finish_puncher (after, 9000)

*source:* `nodeca.core/lib/puncher.js`

Middleware that embeds puncher results


##### inject\_menu (after, 50)

*source:* `nodeca.core/lib/inject_menu.js`

Middleware that injects menus configuration into the environment.


##### inject\_users (after, 50)

*source:* `nodeca.users/lib/filters.js`

Fetch and prepare users info.
List of user id should be prepared in controller.
