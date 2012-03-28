Menus
=====

For client-side menu configuration is bundled on namespace basis (just like
translations) and available as static JSON file. On server-side it's avilable
as `nodeca.config.menus` subtree.

`nodeca.router` is used to build links for menu items.

Menus are rendered (on both server and client side) with special view helper:
`render_menu(namespace, menu_id) -> String`, see details below.


Configuration
-------------

``` yaml
--- # Item titles: ./config/locales/en-us.yml
en-us:
  menus:
    common:
      topnav:
        profile:      Profile
        forum:        Forum
        blogs:        Blogs
        faq:          Questions
        sales:        Sales
        groups:       Groups
        maps:         Maps
        translations: Translations
  # ...
...
--- # Definitions: ./config/menus.yml
menus:
  common:                         # app namespace (see docs/application.md for details on namespaces)
    topnav:                       # menu id
      profile:                    # menu item
        to: user.profile          # server method
        priority: 100             # item priority (optional. default: 100)
        check_permissions: false  # check action permissions to show/hide item (optional. default: false. used with `to` only)

      forum:
        to: forum.topics.list

      blogs:
        to: blog.posts.latest_list

      faq:
        to: faq.latest

      sales:
        to: sales.dashboard

      groups:
        to: groups.dashboard

      maps:
        to: maps.dashboard

      translations:
        to: maps.dshboard

  user:
    profile-sections:
      blog:
        priority: 5
        to: blog.posts

      friends:
        to: user.friends

      photos:
        to: gallery.albums

      messages:
        to: user.messages

      events:
        to: user.events
```


Hiding Menu Items
-----------------

If `check_permissions` is set to `true`, then such menu item will be visible
only if action's _before_ filters are passing without _access denied_ error.

For convenience NLib provides a special helper that returns map of enabled or
disabled menu items:

``` javascript
// nodeca.runtime.get_enabled_menu_items(namespace[, menu_ids][, env], callback)
// - namespace (String):
// - menu_ids (Array):
// - env (Object):
// - callback (Function):
nodeca.runtime.get_enabled_menu_items('user', function (err, permissions) {
  if (err) {
    // shit happens
    return;
  }

  // permissions['profile-sections']['blog'] -> Boolean
  // permissions['profile-sections']['friends'] -> Boolean
  // ...
});
```


Rendering Menus (Server-side)
-----------------------------

`nodeca.core` requests for enabled/disabled menu items map (for current
and _common_ namespaces) right before rendering views and saves it as
`enabled_menu_items` local variable for renderer, which is used by
`render_menu` upon rendering.



Rendering Menus (Client-side)
-----------------------------

Client-side renderer calls `core.get_enabled_menu_items` (proxy to
`nodeca.runtime` method) and receives map of enabled/disabled items as JSON.
