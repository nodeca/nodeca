Themes
======

Themes is additional layer over templates (views) and assets, suited to
conveniently operate with website look. Here are most often use cases:

- You make different skins for desktop, mobile and tablet devices
- You add 3rd-party component, that extends pages with new elements
- You like to customize default look (e.g. recolor with CSS, change logo)

(!) Themes layer does NOT depend on template engines. It's used for easy
morphing of existing theme elements:

- templates override / add / patch
- binaries add / override (useful for images, smiles)


Theme files
===========

In nodeca, theme files are placed under 2 paths: templates & assets:

```
.
├─ assets/
│   └─ <theme-id>/*.* 
└─ views/
    └─ <theme-id>/*.* 
```

1. Some directories can be missed. For example, in inherited themes.
2. In nodeca, theme files are merged from all applications to single dir,
   then patch rules applyed.
3. We use `localised templates` concept - that means, each theme is built
   separately for each language. That allows to reduce translation calls


Theme config
============

Theme can be extended and inherited. In nodeca, `extending` happens
automatically on applications sources merge. Inheritance should be defined
in config.

``` yaml
---
theme_schemas:

  desktop:
    name: Default Default Theme

  # theme id
  mobile:
    # full name
    name: Default Mobile Theme
    # parent id
    inherits: desktop
```


Patches & overrides
===================

Override happens, when file with the same name & the same subfolder, as in
parent, found. Subfolders are relative to base prefix (see directives
`templates`, `static` in config).

If you wish to apply patch - make file with appropriate name & location, but add
`.patch` extentions. For example `./views/theme-mobile/forum/index.jade.patch`.
If template needs sevaral patches, ordered by priorities, add weigth prior to
extention, like `./views/theme-mobile/forum/index.jade.45.patch`. Default weight
is 10.

Note, that patch weights are global.

Patches should be `unified diffs`, applyed with `patch` command. There only
exclution is, when we need just add data to the start or to the end of template.
Then create file with extention `.before` or `.after`.

Unsorted
========

Use this info to create better logs or debug tools.

### Detected errors

- duplicated template filenames (from different folders)
- can't add new template in inherited skin
- try to modify not existing file
- failed to apply patch
- no permissions
- patch error (file not found or apply error)

