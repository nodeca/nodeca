Menus
=====

Menus are special feature, to define static navigation lists, and easily check
access permissions. You can make as many menus as you wish. Menus can be merged
from different applications.

For client-side, menu configuration is bundled on namespace basis (just like
translations) and available as static JSON file. On server-side it's avilable
as `nodeca.config.menus` subtree.

`nodeca.router` is used to build links for menu items.


Configuration
-------------

``` yaml
--- # Definitions: ./config/menus.yml
menus:
  common:                         # app namespace (see docs/application.md for details on namespaces)
    topnav:                       # menu id
      profile:                    # menu item
        to: user.profile          # server method (optional)
        priority: 100             # item priority (optional. default: 100)
        check_permissions: true   # check action permissions to show/hide item (optional. default: false.)

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

Menu texts (translations):

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


Rendering Menus
---------------

_nodeca.core_ registers two special _after_ action filter that exposes a
permission map into `env.response.menu_permissions` for _common_ and current
namespaces (first-level menu ids). Example:

``` javascript
{
  "forum.post.create": false,
  "forum.post.view": true
}
```

Also it provides `common.get_permissions_map` server method which can be used
to get the same object:

```
nodeca.server.common.get_permissions_map(params, callback) -> Void
- params (Object):
- callback (Function):

### params

- **menu_ids** (Array)
```

After all for convenience, we provide a shared method that generates a menu map
by menu id and permission map given to it:

```
nodeca.shared.get_menus(menu_id, permissions_map) -> Object
- menu_ids (Array):
- permissions_map (Object):
```

Right before rendring views (on server/client), we are using this shared method
to build all menu maps as `env.response.data.menus` on server or `locals.menus`
on client. Example of menus map:

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
