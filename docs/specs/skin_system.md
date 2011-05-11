Skinner Architecture & Tools
============================

Skins is additional layer over templates, suited to conveniently operate with website look. Here are most often use cases:

- You make different skins for desktop, mobile and tablet devices
- You add 3rd-party component, that extends pages with new elements
- You wish to use "standard" projects, deployed via `git push`, but with customized look

(!) Skinner does NOT depends on template engine. It allows proper merge, override & patch of skin sources:

- templates override / add / patch
- binaries add / override (useful for images, smiles)
- CLI tool to test consistency

We suppose, that skins sources are placed in file system, and located in several directories. That allows easy
deployment of your modifications with `git push`. Keep your custom modifications/extentions in separate folders,
then build final result from several paths with skinner!

Typical skinner use scenario:

- you run node process
- skinner scans provided paths, finds skins / modifications, calculates build rules
- skinner generates skin resources:
  - copy static files to public directory, according to defined rules in skin configs
  - make transformations on template files
  - write down final templates to defined paths, or return them as hash
- your script compiles returned templates (optional)
- run listen loop

Benefits:

- easy maintenance/deployment/testing. All in small independent repos, node-style :)
- simple dependencies testing, with detailed log & statistics
- joined templates instead of multiple peaces - better rendering speed

Skin source
===========

Each skin consists of directory with templates, static files and yaml config `skin.yml`. Here are several samples.

### Sample 1. Only templates, all in current folder & subfolders

    ---
      id: mobile
      type: new
      ignore: /.*(txt|md)$/i

- `id` - skin id
- `type` (mandatory) - means, that it's a 'root' skin with full files set
- `ignore` - regex to skip files

### Sample 2. Templates + static files (images, for example)

    ---
      id: mobile
      type: new
      static: './images'
      shared: './shared'
      templates: './tpl'
      options:
        name: 'Mobile Skin'
        order: 10

The same as prevoious + more sugar

- `static` - files from this folder are specific for this skin.
- `shared` - files are common for all skins.
- `templates` - templates are not in root, but in specified subfolder
- `options` - just free-style structure, not used by skinner, but passed to final results

If you don't use images - don't care about. Else, this settings will be used to build content of real public
directories on your webserver.

### Sample 3. Inherit existing skin, just modifying some files (for example, CSS)

    ---
      id: mobile2
      type: inherit
      parent: mobile

If any file/template in inherited skin not exists, it will ba taken from parent. That's easy! Still can use
other options, like [static, shared, templates] and so on

WARNING! It's not recommended to add new templates in inherited skins (wich not exists in parrent)

### Sample 4. Extend skin (with new templates & files).

    ---
      id: mobile
      type: extend
      templates: './templates'
      shared: './shared'
      static: './images'

This config does NOT create new skin. It says, we should take skin `mobile` and add/override

### Sample 5. Disable Skin

    ---
      id: mobile
      type: extend
      enable: 0

For example, you want compleetely disable default skin, and use 'inherited' one instead. Then,
`enable` is your hero. Other options can be used in the same tame. So, you can add new files (for childs)
and simultaneously disable current skin.

### Sample 6. Several skins in one pack

    ---
      -
        id: mobile2
        type: inherit
        parent: mobile
        folder: './mob2.chages'
      -
        id: mobile3
        type: inherit
        parent: mobile
        folder: './mob3.chages'
      -
        id: mobile
        type: extend
        folder: './mob.ext'
        templates: './templates'
        shared: './shared'
        static: './images'
        disable: 1
      -
        id: mobile
        type: new
        folder: './mob'
        templates: './templates'
        shared: './shared'
        static: './images'

`folder` - defines offset for skin root. So, every skin data will be in it's own subfolder.

Patches & overrides
===================

Override happens, when file with the same name & the same subfolder, as in parent, found.
Subfolders are relative to base prefix (see directives `templates`, `static`, `shared`, `folder` in config).

If you wish to apply patch - make file with appropriate name & location, but add `.patch` extentions.
For example `./templates/forum/index.jade.patch`. Template needs sevaral patches, ordered by priorities,
add weigth prior to extention, like `./templates/forum/index.jade.45.patch`.

Note, that patch weights are global. That

Skin templates can be not only overriden, but also patched. Make the same file, as for template,
but add `.patch` extention. That will be simple `unified diffs`, applyed with `patch` command.

There only exclution is, when we need just add data to the start or to the end of template. Then
.patch file should start with ##BEGIN## or ##END##, and 'what to add' on next lines.

Examples:

Config setting full list
========================

### id

Skin id. If not set, then config directory name will be used

### type

Mandatory. Skin type - (new|extend|inherit).

- new - full root skin, with all files included
- extend - changes existing skin
- inherit - child skin, slightly modifies parent

### parent

Parent id for inherited skins

### ignore

Regex for ignored files. Example: `/.*(txt|md)$/i`

### templates

Relative path to templates directory. './' by default.

### static

Relative path to static files, specific for this skin. If missed - means, that skin have no static files.

### shared

Relative path to shared static files (common for all skins). If missed - means, that skin have no shared files.

### folder

Relative root folder for skin directories. Useful, when packing several skins in single pack. './' by default.

### disable

Set 1, to exclude all skin data from final results. For example, when you wish to add several childrens,
but hide parent.

### options

Free-style structure, passed to final result. For example, you can define skin description, sort order and so on.

API
===


CLI tool
========

Skinner has CLI utility, that allows to check all skins dependencies, conflicts, and provides
statistics.

### Detected errors

- no enabled skins
- duplicated template filesnames (from different folders)
- can't add new template in inherited skin
- try to modify not existing file
- failed to apply patch
- no permissions

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


Todo
====

1. Specify API
2. Specify CLI tool features & params
3. ? Consider embedding templates, to make single file
