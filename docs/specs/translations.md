
General
=======

We plan to use Jade, so it will be most convenient to use this [jade-i18n progect](https://github.com/LearnBoost/jade-i18n).
It has lack of some features:

- No embedded plurals support, with easy syntax
  - https://github.com/LearnBoost/jade-i18n/issues/3
  - https://github.com/masylum/dialect/blob/master/lib/helpers/plurals.js
- ? No gender support, with easy syntax
- No context-depended phrases support
  - https://github.com/LearnBoost/jade-i18n/issues/4
- No built-in i18n __() for translations without templates
- the same phrases with variables can be different for templates & direct js calls
  - try to avoid such situation. Check if we really need to avoid it.
  - compile such phrases when added, to find ready result by phrase hash
- instruments to make lang files (similar to wordpress makepot.php)

See also:

- https://github.com/naholyr/node-jus-i18n
- https://github.com/ricardobeat/node-polyglot

Proposed changes
================

All changes have 2 points:

1. We need SIMPLE format for translators
2. We need compatible phrases format both templates and code (for example, JSON/XML output don't need templates)

Plurals
-------

We use macros ((...)) to define plurals.

### Example 1. Single var -> 1 or more plurals

    Look, ((there is|there are)) #{ap_count} ((apple|apples)) on the table

Plurals are in double brakets. Variable used to change proper value.

(*) Escape if really needs double brackets as plain text

### Example 2. Several vars -> plurals, all plurals on the right

More rare, but also possible case. Usually, plurals goes after numbers.
So, pattern is still simple

    #{ap_count} ((apple|apples)) and #{p_count} ((pie|pies)) on the table

### Example 3. Several vars <-> plurals, random order

Almost impossible case, but still needed. A bit dirty syntax, but probably never happens :) .

    Look, ((there is|there are)):apcount #{ap_count} ((apple|apples)) and #{p_count} ((pie|pies)) on the table

We use quantifier to directly assign variable for first plural.

### How it works?

If phrase contains macroses, it will be automatically kept in 2 forms: plain and compiled. Simple phrases
will have single form - string. Complex phrases will also have secondary form - function.

Result of compiled phrase will depend on context visible variables. That should work for both
templates and direct __n(...) calls

If phrase not exists, it will be added & compiled at first usage.

Contexts
--------

Some translations are context-dependent. jade-i18n already has 'description' ability. If exists, those should be used
for crc calculations.

Gender
------

Use similar to plurals macros to define gender:

    g((male form|female form))

or

    g((male form|female form)):gender_var

Variable is used as array index. Default name is `gender`. It will be searched in visible vars.


Unified phrases for templates & executable code
-----------------------------------------------

Since we use compiler, when adding phrases, it's no longer problem to use the same phrases in direct JS calls:

    __("Look, ((there is|there are)):apcount #{ap_count} ((apple|apples)) and #{p_count} ((pie|pies)) on the table",
       {app_count: x, p_count: y} )


Helper functions
================

### __(...)

Returns translated phrase

### __n(singular, plural1 [, plural2...], count, lang)

Returns plural form, depending on count and language


Instruments
===========

We need effective instrument to make translations. [dialect-http](https://github.com/masylum/dialect-http)
looks promissing.

Do we really need it? May be, use ubuntu launchpad or similar for the first time? Check for free & nice
alternative to https://webtranslateit.com/ .


### Missed features

- split phrases by projects (namespaces)
  - each subproject can have personal master-file
  - hide duplicated phrases in interface, but keep in exports
- files format
  - JSON | Yaml
  - check how to import/export
  - make tool to autogenerate master files
- authorization/registration via loginza


### Later

- babelfish-like auto translator https://github.com/jbasdf/babelphish/tree/master/lib
  use http://mymemory.translated.net , since google API discontinued
- replace loginza service with owns.
  - Facefook, Google, vKontakte, Yandex, Mailru
  - nodeca
  - ? self (db)
  - ? file
- allows distributed collection of translations
- edit history


Overrides
=========

That depends on language storage type. We need to define load sequence in some way. For
file storage, that can be a number in file name:

   forms.5.ru

For db storage - priority will be e separate field.
? Override mechanism for specific phrases is very similar to skins. Create file with
phrases definitions, and add extension `.override`. Phrases from such file will override
basic one.
