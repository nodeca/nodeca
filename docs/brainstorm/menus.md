Menus
=====

TBD

Upon namespace change (or on application load) once menus config was received as
part of the bundle we request permission test for each menu-item within current
namespace: `core.permissions-test({actions: ['a1', 'a2', ...]})`. Result is an
object: `{a1: true, a2: false, ...}` returned as JSON.


Configuration
-------------

For client-side menu configuration is bundled on namespace basis (just like
translations) and available as static JSON file. On server-side it's avilable
as `nodeca.config.menus` subtree.

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
        check_permissions: false  # check action permissions to show/hide item (optional. default: false)

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

Permission Tests
----------------

NLib provides method that allows to retreive map of permission test results for
specific menu or all menus from namespaces.

TBD
