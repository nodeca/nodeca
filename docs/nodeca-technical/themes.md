Themes
======

Themes is additional layer over templates (views), suited to conveniently operate with website look.
Here are most often use cases:

- You make different skins for desktop, mobile and tablet devices
- You add 3rd-party component, that extends pages with new elements
- You like to customize default look (e.g. recolor tith CSS)

(!) Themes layer does NOT depend on template engines. It's used for easy morphing if existing theme elements:

- templates override / add / patch
- binaries add / override (useful for images, smiles)
- CLI tool to test consistency


Theme files
===========

Each theme consist of directories with templates (views), static files (js/css/images) and config.
In nodeca, we use the following structure:

```
.
├─ assets/
│   └─ theme-<id>/*.* 
├─ views/
│   └─ theme-<id>/*.* 
└─ config/themes/<id>.yml
```

1. Some directories can be missed. For example, in inherited themes.
2. Theme can also add other files, but those will not be used in inheritance rules.
3. Files structure are nodeca-specific. Themer module is more generic: it just
   care about inheritance & patching of directory trees.


Theme config
============

``` yaml
---
  # Use `inherit` or `extend` if theme is based on another one.
  # `inrerit` creates a new theme, `extend` modifies existing.
  # When both absent, than means that it's a root theme with complete file set.
  
  # inherit: parent_id
  # extend: parent_id

  name:  Mobile Theme                   # Full name of theme. Don't mix up with theme id.

  ignore: /.*(txt|md)$/i                # Exclude those files (regex), prior to build theme.
                                        # Can be useful, to skip readme and other description files.
```

Theme id is taken from config file name (without extension).


Patches & overrides
===================

Override happens, when file with the same name & the same subfolder, as in parent, found.
Subfolders are relative to base prefix (see directives `templates`, `static` in config).

If you wish to apply patch - make file with appropriate name & location, but add `.patch` extentions.
For example `./views/theme-mobile/forum/index.jade.patch`. If template needs sevaral patches,
ordered by priorities, add weigth prior to extention, like `./views/theme-mobile/forum/index.jade.45.patch`.

Note, that patch weights are global.

Patches should be `unified diffs`, applyed with `patch` command. There only exclution is,
when we need just add data to the start or to the end of template. Then create file with
extention `.before` or `.after`.

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

### Statistics

total:

- templates
- files
- build time

for each skin:

- description + dependencies (if other skins extend it)
- total templates
- total files
- list of modified files
  - source
  - who overrides (list of skins)
- list of added files
  - source
  - who added

