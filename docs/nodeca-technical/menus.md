Menus
=====

For client-side menu configuration is bundled on namespace basis (just like
translations) and available as static JSON file. On server-side it's avilable
as `nodeca.config.menus` subtree.

`nodeca.router` is used to build links for menu items.


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

    admin:
      system-sidebar:
        settings:                     Tools & Settings
        settings.system:              System Settings
        settings.system.performance:  Performance Mode
        settings.system.license:      License Key

    # ...
```

``` yaml
--- # Definitions: ./config/menus.yml
menus:
  common:                         # app namespace (see docs/application.md for details on namespaces)
    topnav:                       # menu id
      profile:                    # menu item
        to: user.profile          # server method (optional)
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

  admin:
    system-sidebar:
      settings:
        submenu:
          system:
            to: admin.system.dashboard
            submenu:
              performance:
                to admin.system.performance
              license:
                to: admin.system.license

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


Rendering Menus
---------------

Rendering menu on both server or client side envolves initiating of menu
configuration object (don't mess it with menu configuration described above).
This object is produced by getting permissions (for items that require
permission test), leaving only those items who have _allowed_ permissions and
resolving `to` links:

``` javasript
{
  common: {
    topnav: [
      {
        title: "Profile",
        link: "http://nodeca.org/user/profile"
      },
      // ...
    ]
  },

  admin: {
    "system-sidebar": [
      {
        title: "Tools & Settings",
        childs: [
          {
            title: "System Settings",
            link: "http://nodeca.org/admin/settings",
            childs: [
              {
                title: "Performance Mode",
                link: "http://nodeca.org/admin/performance"
              },
              // ...
            ]
          }
        ]
      }
    ]
  }
}
```


#### Server-side

`nodeca.core` prepares `menus` object right before rendering.


#### Client-side

Client-side renderer calls `core.get_enabled_menu_items` (proxy to
`nodeca.runtime` method), and prepares `menus` object before view rendering.
