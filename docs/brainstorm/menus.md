Menus
=====

For client-side menu configuration is bundled on namespace basis (just like
translations) and available as static JSON file. On server-side it's avilable
as `nodeca.config.menus` subtree.

`nodeca.router` is used to build links for menu items.


``` yaml
--- # Item titles: ./config/locales/en-us.yml
en-us:
  menus:
    common:
      main-menu:
        admin: Admin Panel
  # ...
...
--- # Definitions: ./config/menus.yml
menus:
  common:                         # app namespace (see docs/application.md for details on namespaces)
    main-menu:                    # menu id
      admin:                      # menu item
        to: admin.dashboard       # server method
        priority: 10              # item priority (optional. default: 10)
        check_permissions: false  # check action permissions to show/hide item (optional. default: false. used with `to` only)

  user:
    profile-sections:
      blog:
        priority: 5
        to: blog.posts

      friends: user.friends

      # passing options as a string equals to passing mapping
      # with `to` key only. above is a shorthand syntax to:
      #
      #   friends:
      #     to: user.friends

      photos:   gallery.albums
      messages: user.messages
      events:   user.events
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
nodeca.runtime.menu_permissions('user', function (err, permissions) {
  if (err) {
    // shit happens
    return;
  }

  // permissions['profile-sections']['blog'] -> Boolean
  // permissions['profile-sections']['friends'] -> Boolean
  // ...
});



Rendering Menus (Server-side)
-----------------------------

TBD



Rendering Menus (Client-side)
-----------------------------

TBD
